{
  "name": "Booking",
  "type": "object",
  "properties": {
    "tool_id": {
      "type": "string",
      "description": "ID of the booked tool"
    },
    "tool_name": {
      "type": "string",
      "description": "Name of the tool (denormalized for easy access)"
    },
    "tool_image": {
      "type": "string",
      "description": "Primary image of the tool"
    },
    "owner_id": {
      "type": "string",
      "description": "ID of tool owner"
    },
    "owner_name": {
      "type": "string",
      "description": "Name of tool owner"
    },
    "renter_id": {
      "type": "string",
      "description": "ID of person renting"
    },
    "renter_name": {
      "type": "string",
      "description": "Name of renter"
    },
    "start_date": {
      "type": "string",
      "format": "date",
      "description": "Rental start date"
    },
    "end_date": {
      "type": "string",
      "format": "date",
      "description": "Rental end date"
    },
    "total_price": {
      "type": "number",
      "description": "Total rental cost"
    },
    "status": {
      "type": "string",
      "enum": [
        "confirmed",
        "completed",
        "cancelled"
      ],
      "default": "confirmed",
      "description": "Booking status"
    },
    "booking_id": {
      "type": "string",
      "description": "Unique booking reference"
    }
  },
  "required": [
    "tool_id",
    "start_date",
    "end_date",
    "total_price"
  ]
}