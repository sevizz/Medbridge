from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.config import groq
from app.auth import get_user_id
import httpx
import json

router = APIRouter()

class DrugRequest(BaseModel):
    drug_name: str

@router.post("/drug")
async def drug_lookup(req: DrugRequest, user_id: str = Depends(get_user_id)):
    # 1. Try fetching from OpenFDA
    fda_data = None
    try:
        async with httpx.AsyncClient() as client:
            # Search for the drug by brand or generic name
            fda_url = f"https://api.fda.gov/drug/label.json?search=openfda.brand_name:\"{req.drug_name}\"+openfda.generic_name:\"{req.drug_name}\"&limit=1"
            res = await client.get(fda_url)
            if res.status_code == 200:
                fda_data = res.json().get("results", [None])[0]
    except Exception as e:
        print(f"OpenFDA Error: {e}")

    # 2. Construct prompt for Groq
    if fda_data:
        # Extract relevant fields for Groq to summarize
        context = {
            "brand_name": fda_data.get("openfda", {}).get("brand_name", []),
            "generic_name": fda_data.get("openfda", {}).get("generic_name", []),
            "indications_and_usage": fda_data.get("indications_and_usage", []),
            "dosage_and_administration": fda_data.get("dosage_and_administration", []),
            "warnings": fda_data.get("warnings", []),
            "adverse_reactions": fda_data.get("adverse_reactions", []),
            "drug_interactions": fda_data.get("drug_interactions", []),
        }
        prompt = f"""You are a pharmacist for MedBridge. A patient looked up "{req.drug_name}".
I have official FDA label data for this drug (some fields might be lists of strings, summarize them): {json.dumps(context)}

Please summarize this data into a patient-friendly format. 
Return ONLY JSON:
{{"generic_name":"...","what_for":"...","how_to_take":"...","side_effects":"...","avoid":"..."}}"""
    else:
        # Fallback to direct Groq lookup if FDA data is unavailable
        prompt = f"""You are a pharmacist for MedBridge. Patient looked up "{req.drug_name}".
I couldn't find official FDA data for this specific name, so please provide general information from your knowledge.
Return ONLY JSON:
{{"generic_name":"...","what_for":"...","how_to_take":"...","side_effects":"...","avoid":"..."}}"""

    response = groq.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=800,
        messages=[{"role": "user", "content": prompt}]
    )
    
    content = response.choices[0].message.content
    # Clean up potential markdown formatting
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0]
    elif "```" in content:
        content = content.split("```")[1].split("```")[0]
    
    return json.loads(content.strip())
