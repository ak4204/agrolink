{
  "name": "Crop",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the crop"
    },
    "season": {
      "type": "string",
      "description": "Best season for cultivation"
    },
    "investment": {
      "type": "string",
      "description": "Investment required (Low/Medium/High)"
    },
    "profit_potential": {
      "type": "string",
      "description": "Profit potential (Low/Medium/High)"
    },
    "difficulty": {
      "type": "string",
      "description": "Difficulty level for beginners"
    },
    "required_tools": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of required equipment categories"
    },
    "description": {
      "type": "string",
      "description": "Crop description and benefits"
    },
    "image_url": {
      "type": "string",
      "description": "Image of the crop"
    }
  },
  "required": [
    "name",
    "season",
    "investment",
    "profit_potential"
  ]
}