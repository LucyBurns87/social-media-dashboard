// Mock  Data
// This file simulates a JSON API response with comprehensive social media metrics

const PLATFORMS = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok'];

// Generate mock data for engagement over time (last 30 days)
function generateEngagementData() {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        data.push({
            date: date.toISOString().split('T')[0],
            likes: Math.floor(Math.random() * 5000) + 1000,
            comments: Math.floor(Math.random() * 800) + 200,
            shares: Math.floor(Math.random() * 600) + 100,
            clicks: Math.floor(Math.random() * 3000) + 500
        });
    }
    
    return data;
}

// Generate platform-specific performance data
function generatePlatformData() {
    return PLATFORMS.map(platform => {
        const followers = Math.floor(Math.random() * 100000) + 10000;
        const reach = Math.floor(Math.random() * 500000) + 50000;
        const engagement = Math.floor(Math.random() * 50000) + 5000;
        const posts = Math.floor(Math.random() * 50) + 10;
        
        return {
            platform,
            followers,
            reach,
            engagement,
            posts,
            engagementRate: ((engagement / reach) * 100).toFixed(2),
            growthRate: (Math.random() * 20 - 5).toFixed(2), // -5% to +15%
            avgLikesPerPost: Math.floor(engagement * 0.6 / posts),
            avgCommentsPerPost: Math.floor(engagement * 0.25 / posts),
            avgSharesPerPost: Math.floor(engagement * 0.15 / posts)
        };
    });
}

// Generate weekly activity data for heatmap
function generateWeeklyActivity() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = Array.from({length: 24}, (_, i) => i);
    
    const data = [];
    days.forEach((day, dayIndex) => {
        hours.forEach(hour => {
            // Higher activity during business hours (9-17) and evening (19-22)
            let baseActivity = 100;
            if (hour >= 9 && hour <= 17) {
                baseActivity = 500;
            } else if (hour >= 19 && hour <= 22) {
                baseActivity = 600;
            }
            
            // Weekend adjustment
            if (dayIndex >= 5) {
                baseActivity *= 0.7;
            }
            
            data.push({
                day,
                hour,
                activity: Math.floor(baseActivity + Math.random() * 200)
            });
        });
    });
    
    return data;
}

// Generate post performance data
function generatePostPerformance() {
    const posts = [];
    const today = new Date();
    
    for (let i = 0; i < 20; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
        const reach = Math.floor(Math.random() * 50000) + 1000;
        const engagement = Math.floor(Math.random() * 5000) + 100;
        
        posts.push({
            id: i + 1,
            platform,
            date: date.toISOString().split('T')[0],
            reach,
            engagement,
            engagementRate: ((engagement / reach) * 100).toFixed(2),
            likes: Math.floor(engagement * 0.6),
            comments: Math.floor(engagement * 0.25),
            shares: Math.floor(engagement * 0.15),
            type: ['image', 'video', 'carousel', 'text'][Math.floor(Math.random() * 4)]
        });
    }
    
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Generate audience demographics
function generateDemographics() {
    return {
        ageGroups: [
            { range: '13-17', percentage: 8 },
            { range: '18-24', percentage: 28 },
            { range: '25-34', percentage: 35 },
            { range: '35-44', percentage: 18 },
            { range: '45-54', percentage: 7 },
            { range: '55+', percentage: 4 }
        ],
        gender: [
            { type: 'Female', percentage: 52 },
            { type: 'Male', percentage: 46 },
            { type: 'Other', percentage: 2 }
        ],
        topCountries: [
            { country: 'United States', percentage: 35 },
            { country: 'United Kingdom', percentage: 18 },
            { country: 'Canada', percentage: 12 },
            { country: 'Australia', percentage: 10 },
            { country: 'Germany', percentage: 8 },
            { country: 'Other', percentage: 17 }
        ]
    };
}

// Generate content performance insights
function generateContentInsights() {
    return {
        bestPostingTimes: [
            { time: '9:00 AM', engagement: 4200 },
            { time: '1:00 PM', engagement: 3800 },
            { time: '8:00 PM', engagement: 5100 }
        ],
        topHashtags: [
            { tag: '#marketing', uses: 145, reach: 250000 },
            { tag: '#socialmedia', uses: 132, reach: 220000 },
            { tag: '#business', uses: 98, reach: 180000 },
            { tag: '#digital', uses: 87, reach: 165000 },
            { tag: '#content', uses: 76, reach: 140000 }
        ],
        contentTypes: [
            { type: 'Video', posts: 45, avgEngagement: 4500 },
            { type: 'Image', posts: 78, avgEngagement: 3200 },
            { type: 'Carousel', posts: 34, avgEngagement: 3800 },
            { type: 'Text', posts: 23, avgEngagement: 2100 }
        ]
    };
}

// Main API data object
const mockAPIData = {
    engagementOverTime: generateEngagementData(),
    platformPerformance: generatePlatformData(),
    weeklyActivity: generateWeeklyActivity(),
    postPerformance: generatePostPerformance(),
    demographics: generateDemographics(),
    contentInsights: generateContentInsights(),
    
    // Summary KPIs
    summary: {
        totalFollowers: 0, // Calculated from platform data
        totalReach: 0, // Calculated from platform data
        totalEngagement: 0, // Calculated from platform data
        totalPosts: 0, // Calculated from platform data
        avgEngagementRate: 0, // Calculated
        followerGrowth: (Math.random() * 15 + 2).toFixed(2),
        reachGrowth: (Math.random() * 25 + 5).toFixed(2),
        engagementGrowth: (Math.random() * 20 + 3).toFixed(2),
        postsGrowth: (Math.random() * 10 - 2).toFixed(2)
    },
    
    // Metadata
    metadata: {
        lastUpdated: new Date().toISOString(),
        dateRange: '30 days',
        currency: 'USD'
    }
};

// Calculate summary totals from platform data
mockAPIData.summary.totalFollowers = mockAPIData.platformPerformance.reduce((sum, p) => sum + p.followers, 0);
mockAPIData.summary.totalReach = mockAPIData.platformPerformance.reduce((sum, p) => sum + p.reach, 0);
mockAPIData.summary.totalEngagement = mockAPIData.platformPerformance.reduce((sum, p) => sum + p.engagement, 0);
mockAPIData.summary.totalPosts = mockAPIData.platformPerformance.reduce((sum, p) => sum + p.posts, 0);
mockAPIData.summary.avgEngagementRate = (
    (mockAPIData.summary.totalEngagement / mockAPIData.summary.totalReach) * 100
).toFixed(2);

// Simulate API fetch function
function fetchAnalyticsData(filters = {}) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            let data = JSON.parse(JSON.stringify(mockAPIData)); // Deep clone
            
            // Apply platform filter if specified
            if (filters.platform && filters.platform !== 'all') {
                data.platformPerformance = data.platformPerformance.filter(
                    p => p.platform === filters.platform
                );
                
                // Recalculate summary for filtered platform
                data.summary.totalFollowers = data.platformPerformance.reduce((sum, p) => sum + p.followers, 0);
                data.summary.totalReach = data.platformPerformance.reduce((sum, p) => sum + p.reach, 0);
                data.summary.totalEngagement = data.platformPerformance.reduce((sum, p) => sum + p.engagement, 0);
                data.summary.totalPosts = data.platformPerformance.reduce((sum, p) => sum + p.posts, 0);
            }
            
            // Apply date range filter
            if (filters.dateRange) {
                const daysToKeep = parseInt(filters.dateRange);
                data.engagementOverTime = data.engagementOverTime.slice(-daysToKeep);
            }
            
            // Apply sorting
            if (filters.sortBy) {
                const sortField = filters.sortBy;
                data.platformPerformance.sort((a, b) => {
                    const aVal = typeof a[sortField] === 'string' ? parseFloat(a[sortField]) : a[sortField];
                    const bVal = typeof b[sortField] === 'string' ? parseFloat(b[sortField]) : b[sortField];
                    return bVal - aVal;
                });
            }
            
            resolve(data);
        }, 500); // 500ms delay to simulate API call
    });
}

// Export for use in other files
window.mockAPIData = mockAPIData;
window.fetchAnalyticsData = fetchAnalyticsData;
