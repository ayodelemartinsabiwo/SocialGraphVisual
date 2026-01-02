const mockData = {
    meta: {
        generatedAt: "2025-12-29T10:00:00Z",
        source: "Simulation"
    },
    nodes: [
        { id: "you", label: "You", cluster: "core", engagementLevel: "owner", influenceScore: 100 },
        // Tech Twitter cluster
        { id: "t1", label: "dev_sam", cluster: "tech", engagementLevel: "super", influenceScore: 92 },
        { id: "t2", label: "ai_ade", cluster: "tech", engagementLevel: "active", influenceScore: 78 },
        { id: "t3", label: "js_jane", cluster: "tech", engagementLevel: "active", influenceScore: 74 },
        { id: "t4", label: "rustacean", cluster: "tech", engagementLevel: "ghost", influenceScore: 55 },
        { id: "t5", label: "oss_lee", cluster: "tech", engagementLevel: "super", influenceScore: 88 },
        { id: "t6", label: "cliara", cluster: "tech", engagementLevel: "active", influenceScore: 69 },
        { id: "t7", label: "ml_ops", cluster: "tech", engagementLevel: "ghost", influenceScore: 58 },
        // Local friends
        { id: "l1", label: "amina", cluster: "local", engagementLevel: "active", influenceScore: 60 },
        { id: "l2", label: "bola", cluster: "local", engagementLevel: "ghost", influenceScore: 40 },
        { id: "l3", label: "tomiwa", cluster: "local", engagementLevel: "active", influenceScore: 52 },
        { id: "l4", label: "yinka", cluster: "local", engagementLevel: "super", influenceScore: 72 },
        // Conference
        { id: "c1", label: "cx_rita", cluster: "conf", engagementLevel: "active", influenceScore: 77 },
        { id: "c2", label: "pm_karl", cluster: "conf", engagementLevel: "ghost", influenceScore: 48 },
        { id: "c3", label: "infra_tess", cluster: "conf", engagementLevel: "super", influenceScore: 85 },
        { id: "c4", label: "talks_jay", cluster: "conf", engagementLevel: "active", influenceScore: 63 },
        // Influencer bridge
        { id: "b1", label: "tara_lifts", cluster: "bridge", engagementLevel: "super", influenceScore: 96 },
        { id: "b2", label: "media_kai", cluster: "bridge", engagementLevel: "active", influenceScore: 81 },
        // Additional filler to 40+ nodes
        ...Array.from({ length: 30 }).map((_, i) => ({
            id: `n${i+100}`,
            label: `node_${i+100}`,
            cluster: i % 2 === 0 ? "tech" : "conf",
            engagementLevel: ["super","active","ghost"][i % 3],
            influenceScore: 40 + (i % 60)
        }))
    ],
    links: [
        { source: "you", target: "t1", weight: 8 },
        { source: "you", target: "t2", weight: 6 },
        { source: "you", target: "l1", weight: 4 },
        { source: "you", target: "c1", weight: 5 },
        { source: "you", target: "b1", weight: 3 },
        { source: "t1", target: "t5", weight: 7 },
        { source: "t2", target: "t3", weight: 6 },
        { source: "t3", target: "t4", weight: 3 },
        { source: "t5", target: "b1", weight: 5 },
        { source: "l1", target: "l2", weight: 2 },
        { source: "l3", target: "l4", weight: 4 },
        { source: "c1", target: "c3", weight: 6 },
        { source: "c3", target: "b1", weight: 5 },
        { source: "b1", target: "b2", weight: 4 },
        // filler links
        ...Array.from({ length: 40 }).map((_, i) => ({
            source: "you",
            target: `n${100 + i}`,
            weight: 1 + (i % 5)
        }))
    ]
};

export default mockData;
