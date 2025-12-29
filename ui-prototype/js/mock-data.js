/**
 * Visual Social Graph - Mock Data
 * Comprehensive demo data for UI mockup
 *
 * Includes: 150 nodes, 8 communities, insights, and metrics
 */

const VSG_MOCK_DATA = {
  // Metadata
  meta: {
    generatedAt: "2025-12-29T10:00:00Z",
    source: "Twitter Archive",
    networkName: "My Twitter Network",
    uploadDate: "December 29, 2025",
    totalNodes: 247,
    totalEdges: 1842,
    processingTime: "12.4s"
  },

  // User profile (the "YOU" node)
  user: {
    id: "user_001",
    name: "Alex Morgan",
    handle: "@alexmorgan",
    avatar: null, // Use initials fallback
    joinedDate: "March 2018",
    networks: 3
  },

  // Network statistics
  stats: {
    totalConnections: 247,
    strongTies: 42,
    weakTies: 205,
    bridgeConnections: 8,
    communities: 8,
    networkDensity: 0.062,
    avgPathLength: 2.4,
    clusteringCoefficient: 0.34
  },

  // Community definitions
  communities: [
    { id: 0, name: "Tech Industry", color: "#F97316", nodeCount: 84, icon: "💻" },
    { id: 1, name: "College Friends", color: "#3B82F6", nodeCount: 63, icon: "🎓" },
    { id: 2, name: "Startup Founders", color: "#10B981", nodeCount: 38, icon: "🚀" },
    { id: 3, name: "Design Community", color: "#8B5CF6", nodeCount: 28, icon: "🎨" },
    { id: 4, name: "Local Network", color: "#EC4899", nodeCount: 18, icon: "📍" },
    { id: 5, name: "Investment/VC", color: "#F59E0B", nodeCount: 12, icon: "💰" },
    { id: 6, name: "Media & Content", color: "#06B6D4", nodeCount: 6, icon: "📱" },
    { id: 7, name: "Family", color: "#84CC16", nodeCount: 8, icon: "👨‍👩‍👧‍👦" }
  ],

  // Sample nodes (showing representative sample)
  nodes: [
    // YOU node
    { id: "user_001", label: "You", type: "primary", communityId: 0,
      betweenness: 0.152, pagerank: 0.084, degree: 247,
      x: 0, y: 0, radius: 24 },

    // High-importance bridge nodes
    { id: "node_002", label: "Sarah Johnson", type: "bridge", communityId: 1,
      betweenness: 0.089, pagerank: 0.042, degree: 156,
      role: "VP Engineering @ TechCorp", mutualConnections: 34 },
    { id: "node_003", label: "Marcus Chen", type: "bridge", communityId: 2,
      betweenness: 0.076, pagerank: 0.038, degree: 142,
      role: "Founder @ StartupX", mutualConnections: 28 },
    { id: "node_004", label: "Emily Rodriguez", type: "bridge", communityId: 3,
      betweenness: 0.068, pagerank: 0.035, degree: 98,
      role: "Design Director @ Agency", mutualConnections: 22 },

    // Tech Industry community (sample)
    { id: "node_010", label: "David Kim", type: "secondary", communityId: 0,
      betweenness: 0.032, pagerank: 0.018, degree: 67,
      role: "Senior Engineer @ Google" },
    { id: "node_011", label: "Lisa Park", type: "secondary", communityId: 0,
      betweenness: 0.028, pagerank: 0.016, degree: 54,
      role: "Product Manager @ Meta" },
    { id: "node_012", label: "James Wilson", type: "secondary", communityId: 0,
      betweenness: 0.024, pagerank: 0.014, degree: 45,
      role: "CTO @ Series B Startup" },
    { id: "node_013", label: "Anna Lee", type: "secondary", communityId: 0,
      betweenness: 0.022, pagerank: 0.013, degree: 42,
      role: "Engineering Manager" },
    { id: "node_014", label: "Michael Brown", type: "secondary", communityId: 0,
      betweenness: 0.019, pagerank: 0.011, degree: 38,
      role: "Staff Developer" },

    // College Friends community (sample)
    { id: "node_020", label: "Jessica Taylor", type: "secondary", communityId: 1,
      betweenness: 0.018, pagerank: 0.012, degree: 34,
      role: "Classmate, CS 2015" },
    { id: "node_021", label: "Ryan Martinez", type: "secondary", communityId: 1,
      betweenness: 0.016, pagerank: 0.010, degree: 31,
      role: "Study Group" },
    { id: "node_022", label: "Amanda White", type: "secondary", communityId: 1,
      betweenness: 0.015, pagerank: 0.009, degree: 28,
      role: "Dorm Mate" },

    // Startup Founders community (sample)
    { id: "node_030", label: "Kevin Zhang", type: "secondary", communityId: 2,
      betweenness: 0.025, pagerank: 0.015, degree: 52,
      role: "YC W21 Founder" },
    { id: "node_031", label: "Rachel Green", type: "secondary", communityId: 2,
      betweenness: 0.021, pagerank: 0.013, degree: 45,
      role: "2x Founder" },
    { id: "node_032", label: "Tom Harris", type: "secondary", communityId: 2,
      betweenness: 0.018, pagerank: 0.011, degree: 38,
      role: "Seed Stage Founder" },

    // Design Community (sample)
    { id: "node_040", label: "Sophia Adams", type: "secondary", communityId: 3,
      betweenness: 0.020, pagerank: 0.012, degree: 36,
      role: "Principal Designer" },
    { id: "node_041", label: "Chris Evans", type: "secondary", communityId: 3,
      betweenness: 0.017, pagerank: 0.010, degree: 32,
      role: "UX Lead" },

    // Investment/VC community (sample)
    { id: "node_050", label: "Patricia Moore", type: "secondary", communityId: 5,
      betweenness: 0.035, pagerank: 0.022, degree: 78,
      role: "Partner @ Top VC" },
    { id: "node_051", label: "Robert Garcia", type: "secondary", communityId: 5,
      betweenness: 0.028, pagerank: 0.018, degree: 62,
      role: "Angel Investor" },

    // Family
    { id: "node_060", label: "Mom", type: "secondary", communityId: 7,
      betweenness: 0.005, pagerank: 0.004, degree: 12,
      role: "Family" },
    { id: "node_061", label: "Dad", type: "secondary", communityId: 7,
      betweenness: 0.004, pagerank: 0.003, degree: 10,
      role: "Family" },
    { id: "node_062", label: "Sister", type: "secondary", communityId: 7,
      betweenness: 0.006, pagerank: 0.005, degree: 15,
      role: "Family" }
  ],

  // Sample edges (showing representative connections)
  edges: [
    // User connections
    { source: "user_001", target: "node_002", weight: 0.92, interactions: 156 },
    { source: "user_001", target: "node_003", weight: 0.88, interactions: 134 },
    { source: "user_001", target: "node_004", weight: 0.85, interactions: 112 },
    { source: "user_001", target: "node_010", weight: 0.76, interactions: 89 },
    { source: "user_001", target: "node_020", weight: 0.72, interactions: 78 },
    { source: "user_001", target: "node_030", weight: 0.68, interactions: 65 },
    { source: "user_001", target: "node_040", weight: 0.64, interactions: 54 },
    { source: "user_001", target: "node_050", weight: 0.58, interactions: 42 },
    { source: "user_001", target: "node_060", weight: 0.95, interactions: 234 },

    // Bridge connections
    { source: "node_002", target: "node_010", weight: 0.72, interactions: 67 },
    { source: "node_002", target: "node_020", weight: 0.54, interactions: 34 },
    { source: "node_003", target: "node_030", weight: 0.82, interactions: 98 },
    { source: "node_003", target: "node_050", weight: 0.68, interactions: 56 },
    { source: "node_004", target: "node_040", weight: 0.78, interactions: 78 },

    // Intra-community connections
    { source: "node_010", target: "node_011", weight: 0.65, interactions: 45 },
    { source: "node_010", target: "node_012", weight: 0.58, interactions: 38 },
    { source: "node_020", target: "node_021", weight: 0.72, interactions: 56 },
    { source: "node_020", target: "node_022", weight: 0.68, interactions: 48 },
    { source: "node_030", target: "node_031", weight: 0.75, interactions: 62 },
    { source: "node_030", target: "node_032", weight: 0.62, interactions: 44 }
  ],

  // Insights generated from network analysis
  insights: [
    {
      id: "ins_001",
      type: "bridge_connection",
      typeLabel: "Bridge Connection",
      icon: "🔗",
      title: "Sarah connects you to 200+ new people",
      description: "Sarah Johnson is your most valuable bridge connection. She links your Tech Industry network to your College Friends community, giving you access to 213 people you wouldn't otherwise reach.",
      confidence: "high",
      confidenceScore: 0.92,
      recommendations: [
        "Schedule a catch-up with Sarah this month",
        "Ask Sarah for intros to key people in her network",
        "Strengthen this relationship with regular engagement"
      ],
      relatedNodeIds: ["node_002", "node_020", "node_021"],
      metrics: {
        bridgedNodes: 213,
        pathReduction: 2.4
      }
    },
    {
      id: "ins_002",
      type: "dormant_relationship",
      typeLabel: "Dormant Relationship",
      icon: "😴",
      title: "Marcus hasn't heard from you in 6 months",
      description: "Your connection with Marcus Chen (Founder @ StartupX) has gone quiet. You used to interact weekly, but there's been no engagement for 187 days. This is a high-value relationship worth rekindling.",
      confidence: "high",
      confidenceScore: 0.88,
      recommendations: [
        "Send Marcus a quick 'thinking of you' message",
        "Share an article relevant to his startup",
        "Propose a coffee chat to catch up"
      ],
      relatedNodeIds: ["node_003"],
      metrics: {
        daysSilent: 187,
        previousFrequency: "Weekly",
        relationshipValue: "High"
      }
    },
    {
      id: "ins_003",
      type: "rising_star",
      typeLabel: "Rising Star",
      icon: "⭐",
      title: "Kevin Zhang is gaining influence fast",
      description: "Kevin Zhang's network has grown 340% in the past 3 months. As a YC W21 founder, his rising prominence could benefit your network. You're connected but haven't engaged recently.",
      confidence: "medium",
      confidenceScore: 0.74,
      recommendations: [
        "Engage with Kevin's recent posts",
        "Congratulate him on his startup's progress",
        "Explore collaboration opportunities"
      ],
      relatedNodeIds: ["node_030"],
      metrics: {
        growthRate: "340%",
        period: "3 months",
        currentRank: 12
      }
    },
    {
      id: "ins_004",
      type: "echo_chamber",
      typeLabel: "Diversity Gap",
      icon: "🔄",
      title: "Your Tech bubble is limiting your reach",
      description: "68% of your network is in Tech Industry. This concentration may limit diverse perspectives and opportunities. Consider expanding into adjacent communities like Design or Investment.",
      confidence: "medium",
      confidenceScore: 0.68,
      recommendations: [
        "Attend cross-industry events",
        "Ask Emily for intros to design leaders",
        "Engage with content outside tech"
      ],
      relatedNodeIds: ["node_004", "node_050"],
      metrics: {
        dominantCommunity: "Tech Industry",
        concentration: "68%",
        diversityScore: 4.2
      }
    },
    {
      id: "ins_005",
      type: "strong_tie",
      typeLabel: "Strong Tie",
      icon: "💪",
      title: "Your family connections are your strongest",
      description: "Your family cluster shows the highest engagement rates in your network. These 8 connections account for 23% of your total interactions despite being only 3% of your network.",
      confidence: "high",
      confidenceScore: 0.95,
      recommendations: [
        "Continue nurturing these core relationships",
        "Consider introducing family to professional contacts",
        "Use family network for support and advice"
      ],
      relatedNodeIds: ["node_060", "node_061", "node_062"],
      metrics: {
        engagementShare: "23%",
        networkShare: "3%",
        avgInteractionFrequency: "Daily"
      }
    },
    {
      id: "ins_006",
      type: "opportunity",
      typeLabel: "Opportunity",
      icon: "🎯",
      title: "Patricia Moore could open VC doors",
      description: "Patricia Moore is a Partner at a top VC firm and you have a warm connection through Marcus. She's invested in 3 companies in your network. This is an untapped opportunity for introductions.",
      confidence: "medium",
      confidenceScore: 0.71,
      recommendations: [
        "Ask Marcus for a warm intro to Patricia",
        "Engage with Patricia's investment thesis posts",
        "Prepare your pitch before reaching out"
      ],
      relatedNodeIds: ["node_050", "node_003"],
      metrics: {
        mutualConnections: 3,
        investmentFit: "High",
        pathLength: 2
      }
    }
  ],

  // Activity timeline for processing simulation
  processingStages: [
    { id: 1, label: "Reading archive file", duration: 2000, complete: true },
    { id: 2, label: "Extracting connections", duration: 3000, complete: true },
    { id: 3, label: "Building network graph", duration: 2500, complete: true },
    { id: 4, label: "Detecting communities", duration: 2000, complete: true },
    { id: 5, label: "Calculating metrics", duration: 1500, complete: true },
    { id: 6, label: "Generating insights", duration: 1400, complete: true }
  ],

  // Platform options for upload flow
  platforms: [
    {
      id: "twitter",
      name: "Twitter / X",
      icon: "𝕏",
      supported: true,
      downloadUrl: "https://twitter.com/settings/download_your_data",
      waitTime: "24-48 hours",
      fileSize: "~50-500MB",
      instructions: [
        "Go to Settings → Your Account → Download an archive",
        "Click 'Request archive' and verify your identity",
        "Wait for email notification (usually 24-48 hours)",
        "Download the ZIP file from the link in the email",
        "Upload the complete ZIP file here"
      ]
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "in",
      supported: true,
      downloadUrl: "https://www.linkedin.com/mypreferences/d/download-my-data",
      waitTime: "~10 minutes",
      fileSize: "~10-50MB",
      instructions: [
        "Go to Settings → Data Privacy → Get a copy of your data",
        "Select 'Connections' and other relevant data",
        "Click 'Request archive'",
        "Download when ready (usually within 10 minutes)",
        "Upload the ZIP file here"
      ]
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📷",
      supported: true,
      downloadUrl: "https://www.instagram.com/download/request/",
      waitTime: "Up to 48 hours",
      fileSize: "~100MB-2GB",
      instructions: [
        "Go to Settings → Privacy and Security → Download Data",
        "Enter your email and request download",
        "Wait for email with download link",
        "Download and extract the ZIP file",
        "Upload the complete folder here"
      ]
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "f",
      supported: true,
      downloadUrl: "https://www.facebook.com/dyi/",
      waitTime: "Hours to days",
      fileSize: "~500MB-5GB",
      instructions: [
        "Go to Settings → Your Facebook Information → Download Your Information",
        "Select 'Friends' and 'Messages' categories",
        "Choose JSON format for best compatibility",
        "Request and wait for download link email",
        "Upload the complete ZIP here"
      ]
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "♪",
      supported: false,
      comingSoon: true
    },
    {
      id: "mastodon",
      name: "Mastodon",
      icon: "🐘",
      supported: false,
      comingSoon: true
    }
  ],

  // Settings options
  settings: {
    appearance: {
      theme: "system", // "light" | "dark" | "system"
      reducedMotion: false
    },
    privacy: {
      analyticsEnabled: false,
      crashReportsEnabled: true
    },
    data: {
      autoDeleteDays: 30,
      localStorageUsed: "124 MB"
    }
  }
};

// Helper function to generate additional nodes for realistic visualization
function generateNodes(count) {
  const names = [
    "Oliver Smith", "Emma Johnson", "Liam Williams", "Ava Brown", "Noah Jones",
    "Isabella Garcia", "Ethan Miller", "Sophia Davis", "Mason Martinez", "Mia Anderson",
    "Logan Taylor", "Charlotte Thomas", "Lucas Jackson", "Amelia White", "Alexander Harris",
    "Harper Martin", "Benjamin Thompson", "Evelyn Robinson", "Elijah Clark", "Abigail Lewis",
    "William Walker", "Emily Hall", "James Allen", "Elizabeth Young", "Sebastian King",
    "Sofia Wright", "Daniel Scott", "Victoria Green", "Henry Baker", "Grace Adams",
    "Jackson Nelson", "Chloe Hill", "Aiden Rivera", "Penelope Campbell", "Matthew Mitchell",
    "Layla Roberts", "Joseph Carter", "Riley Phillips", "David Evans", "Zoey Turner",
    "Carter Collins", "Nora Edwards", "Owen Stewart", "Lily Sanchez", "Wyatt Morris",
    "Hannah Rogers", "John Reed", "Addison Cook", "Jack Morgan", "Ellie Bailey"
  ];

  const roles = [
    "Software Engineer", "Product Designer", "Data Scientist", "Marketing Manager",
    "Startup Founder", "VC Associate", "Content Creator", "UX Researcher",
    "Engineering Manager", "Growth Lead", "Developer Advocate", "Tech Writer",
    "Design Lead", "Sales Director", "Operations Manager", "HR Director"
  ];

  const nodes = [];
  for (let i = 0; i < count; i++) {
    const communityId = Math.floor(Math.random() * 8);
    nodes.push({
      id: `gen_node_${i}`,
      label: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
      type: "secondary",
      communityId: communityId,
      betweenness: Math.random() * 0.05,
      pagerank: Math.random() * 0.02,
      degree: Math.floor(Math.random() * 40) + 5,
      role: roles[Math.floor(Math.random() * roles.length)]
    });
  }
  return nodes;
}

// Generate edges between nodes
function generateEdges(nodes) {
  const edges = [];
  const edgeSet = new Set();

  nodes.forEach(node => {
    // Each node gets 2-8 random connections
    const connectionCount = Math.floor(Math.random() * 7) + 2;
    for (let i = 0; i < connectionCount; i++) {
      const targetIndex = Math.floor(Math.random() * nodes.length);
      const target = nodes[targetIndex];

      if (target.id !== node.id) {
        const edgeKey = [node.id, target.id].sort().join('-');
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({
            source: node.id,
            target: target.id,
            weight: Math.random() * 0.8 + 0.2,
            interactions: Math.floor(Math.random() * 100) + 5
          });
        }
      }
    }
  });

  return edges;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VSG_MOCK_DATA;
}
