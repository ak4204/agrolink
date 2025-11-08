{
  "name": "Tool",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the farm equipment"
    },
    "category": {
      "type": "string",
      "enum": [
        "Tractor",
        "Harvester",
        "Planter",
        "Sprayer",
        "Irrigation",
        "Tiller",
        "Mower",
        "Other"
      ],
      "description": "Type of equipment"
    },
    "description": {
      "type": "string",
      "description": "Detailed description of the tool"
    },
    "price_per_day": {
      "type": "number",
      "description": "Daily rental price in Indian Rupees"
    },
    "location": {
      "type": "string",
      "description": "Location where the tool is available"
    },
    "images": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of image URLs"
    },
    "is_available": {
      "type": "boolean",
      "default": true,
      "description": "Whether the tool is currently available"
    },
    "owner_name": {
      "type": "string",
      "description": "Name of the owner"
    },
    "owner_contact": {
      "type": "string",
      "description": "Contact information"
    },
    "ai_condition_score": {
      "type": "number",
      "description": "AI-generated condition rating (1-5)"
    },
    "ai_feedback": {
      "type": "string",
      "description": "AI analysis feedback on equipment condition"
    },
    "ai_reliability_score": {
      "type": "string",
      "description": "AI reliability estimate (Low/Medium/High)"
    },
    "ai_presentation_tips": {
      "type": "string",
      "description": "AI suggestions for better photo presentation"
    },
    "last_analysis_date": {
      "type": "string",
      "format": "date-time",
      "description": "Last AI analysis date"
    }
  },
  "required": [
    "name",
    "category",
    "description",
    "price_per_day",
    "location"
  ]
}