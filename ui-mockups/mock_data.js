const mockData = {
    "meta": {
        "generatedAt": "2025-12-29T10:00:00Z",
        "source": "Simulation"
    },
    "nodes": [
        { "id": "1", "label": "User_Root", "type": "primary", "influenceScore": 100 },
        { "id": "2", "label": "Connection_A", "type": "secondary", "influenceScore": 85 },
        { "id": "3", "label": "Connection_B", "type": "secondary", "influenceScore": 60 },
        { "id": "4", "label": "Influencer_X", "type": "tertiary", "influenceScore": 95 },
        { "id": "5", "label": "Community_Lead", "type": "tertiary", "influenceScore": 72 }
    ],
    "links": [
        { "source": "1", "target": "2", "weight": 5 },
        { "source": "1", "target": "3", "weight": 3 },
        { "source": "2", "target": "4", "weight": 8 },
        { "source": "3", "target": "5", "weight": 4 },
        { "source": "4", "target": "1", "weight": 2 }
    ]
};

export default mockData;
