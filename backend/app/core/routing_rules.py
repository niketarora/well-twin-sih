from typing import List

# Category -> recipient role mapping for Manual SOS notification routing.
# This is business/routing logic (not a secret) and is intentionally version-controlled here.
# Actual phone numbers are never stored in this file - they come only from the seeded/managed
# `Contact` table (see app/db/seed.py and app/models/contact.py).
SOS_CATEGORY_ROUTING = {
    "FIRE_SMOKE": ["SAFETY", "SECURITY", "SHIFT_SUPERVISOR"],
    "UNUSUAL_SMELL": ["SAFETY", "SECURITY"],
    "SUSPECTED_LEAK": ["SAFETY", "FIELD_ENGINEER", "SHIFT_SUPERVISOR"],
    "FLUID_LEAK": ["SAFETY", "FIELD_ENGINEER", "SHIFT_SUPERVISOR"],
    "MEDICAL_EMERGENCY": ["MEDICAL", "SECURITY"],
    "EQUIPMENT_HAZARD": ["FIELD_ENGINEER", "SAFETY"],
    "PERSONNEL_DANGER": ["SECURITY", "SAFETY", "SHIFT_SUPERVISOR"],
    "OTHER": ["SHIFT_SUPERVISOR", "SECURITY"],
}

DEFAULT_ROUTING = SOS_CATEGORY_ROUTING["OTHER"]

def get_recipient_roles(category: str) -> List[str]:
    return SOS_CATEGORY_ROUTING.get(category, DEFAULT_ROUTING)
