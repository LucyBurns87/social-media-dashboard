// Handles data visualization, filtering, dark mode, and interactivity

// Global state
let currentData = null;
let charts = {};
let isDarkMode = false;

// Chart.js default configuration
Chart.defaults.color = '#718096';
Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.1)';
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        toggleDarkMode();
    }
    
    // Load initial data
    await loadDashboardData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update last updated timestamp
    updateTimestamp();
});

// Load and display dashboard data
async function loadDashboardData() {
    const filters = {
        platform: document.getElementById('platformFilter').value,
        dateRange: document.getElementById('dateRange').value,
        sortBy: document.getElementById('sortBy').value
    };
    
    // Show loading state
    document.body.classList.add('loading');
    
    try {
        currentData = await fetchAnalyticsData(filters);
        
        // Update all dashboard components
        updateKPIs(currentData.summary);
        updateCharts(currentData);
        updateTable(currentData.platformPerformance);
        updateTimestamp();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Failed to load dashboard data. Please try again.');
    } finally {
        document.body.classList.remove('loading');
    }
}

// Update KPI cards
function updateKPIs(summary) {
    // Format numbers with commas
    const formatNumber = (num) => num.toLocaleString();
    
    document.getElementById('totalFollowers').textContent = formatNumber(summary.totalFollowers);
    document.getElementById('totalReach').textContent = formatNumber(summary.totalReach);
    document.getElementById('engagementRate').textContent = summary.avgEngagementRate + '%';
    document.getElementById('totalPosts').textContent = formatNumber(summary.totalPosts);
    
    // Update growth indicators
    updateGrowthIndicator('followersChange', summary.followerGrowth);
    updateGrowthIndicator('reachChange', summary.reachGrowth);
    updateGrowthIndicator('engagementChange', summary.engagementGrowth);
    updateGrowthIndicator('postsChange', summary.postsGrowth);
}

// Update growth indicator styling
function updateGrowthIndicator(elementId, value) {
    const element = document.getElementById(elementId);
    const numValue = parseFloat(value);
    
    element.textContent = (numValue >= 0 ? '+' : '') + value + '%';
    
    element.classList.remove('positive', 'negative', 'neutral');
    if (numValue > 0) {
        element.classList.add('positive');
    } else if (numValue < 0) {
        element.classList.add('negative');
    } else {
        element.classList.add('neutral');
    }
}

// Update all charts
function updateCharts(data) {
    createEngagementChart(data.engagementOverTime);
    createPlatformChart(data.platformPerformance);
    createReachEngagementChart(data.platformPerformance);
    createPostPerformanceChart(data.platformPerformance);
    createHeatmapChart(data.weeklyActivity);
}

// Create Engagement Over Time Line Chart
function createEngagementChart(data) {
    const ctx = document.getElementById('engagementChart');
    
    if (charts.engagement) {
        charts.engagement.destroy();
    }
    
    const labels = data.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    charts.engagement = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Likes',
                    data: data.map(d => d.likes),
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Comments',
                    data: data.map(d => d.comments),
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Shares',
                    data: data.map(d => d.shares),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    titleColor: isDarkMode ? '#f1f5f9' : '#2d3748',
                    bodyColor: isDarkMode ? '#cbd5e1' : '#718096',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create Platform Distribution Doughnut Chart
function createPlatformChart(data) {
    const ctx = document.getElementById('platformChart');
    
    if (charts.platform) {
        charts.platform.destroy();
    }
    
    const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
    
    charts.platform = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(d => d.platform),
            datasets: [{
                data: data.map(d => d.followers),
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: isDarkMode ? '#1e293b' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed.toLocaleString();
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    },
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    titleColor: isDarkMode ? '#f1f5f9' : '#2d3748',
                    bodyColor: isDarkMode ? '#cbd5e1' : '#718096',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    borderWidth: 1
                }
            }
        }
    });
}

// Create Reach vs Engagement Scatter Chart
function createReachEngagementChart(data) {
    const ctx = document.getElementById('reachEngagementChart');
    
    if (charts.reachEngagement) {
        charts.reachEngagement.destroy();
    }
    
    const colors = {
        'Facebook': '#4f46e5',
        'Instagram': '#06b6d4',
        'Twitter': '#10b981',
        'LinkedIn': '#f59e0b',
        'TikTok': '#ef4444'
    };
    
    charts.reachEngagement = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: data.map(platform => ({
                label: platform.platform,
                data: [{
                    x: platform.reach,
                    y: platform.engagement
                }],
                backgroundColor: colors[platform.platform],
                borderColor: colors[platform.platform],
                pointRadius: 8,
                pointHoverRadius: 12
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: Reach ${context.parsed.x.toLocaleString()}, Engagement ${context.parsed.y.toLocaleString()}`;
                        }
                    },
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    titleColor: isDarkMode ? '#f1f5f9' : '#2d3748',
                    bodyColor: isDarkMode ? '#cbd5e1' : '#718096',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Reach'
                    },
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Engagement'
                    },
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Create Post Performance Bar Chart
function createPostPerformanceChart(data) {
    const ctx = document.getElementById('postPerformanceChart');
    
    if (charts.postPerformance) {
        charts.postPerformance.destroy();
    }
    
    charts.postPerformance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.platform),
            datasets: [
                {
                    label: 'Avg Likes',
                    data: data.map(d => d.avgLikesPerPost),
                    backgroundColor: '#4f46e5'
                },
                {
                    label: 'Avg Comments',
                    data: data.map(d => d.avgCommentsPerPost),
                    backgroundColor: '#06b6d4'
                },
                {
                    label: 'Avg Shares',
                    data: data.map(d => d.avgSharesPerPost),
                    backgroundColor: '#10b981'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    titleColor: isDarkMode ? '#f1f5f9' : '#2d3748',
                    bodyColor: isDarkMode ? '#cbd5e1' : '#718096',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create Weekly Activity Heatmap (using bar chart)
function createHeatmapChart(data) {
    const ctx = document.getElementById('heatmapChart');
    
    if (charts.heatmap) {
        charts.heatmap.destroy();
    }
    
    // Aggregate by day of week
    const dayData = {};
    data.forEach(item => {
        if (!dayData[item.day]) {
            dayData[item.day] = 0;
        }
        dayData[item.day] += item.activity;
    });
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    charts.heatmap = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'Activity Level',
                data: days.map(day => dayData[day]),
                backgroundColor: days.map((_, i) => {
                    const colors = ['#4f46e5', '#5b52e8', '#675eeb', '#736aee', '#7f76f1', '#8b82f4', '#978ef7'];
                    return colors[i];
                }),
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Activity: ${context.parsed.y.toLocaleString()}`;
                        }
                    },
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    titleColor: isDarkMode ? '#f1f5f9' : '#2d3748',
                    bodyColor: isDarkMode ? '#cbd5e1' : '#718096',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Update performance table
function updateTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    data.forEach(platform => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${platform.platform}</td>
            <td>${platform.followers.toLocaleString()}</td>
            <td>${platform.reach.toLocaleString()}</td>
            <td>${platform.engagement.toLocaleString()}</td>
            <td>${platform.posts}</td>
            <td>${platform.engagementRate}%</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    
    // Filter changes
    document.getElementById('platformFilter').addEventListener('change', loadDashboardData);
    document.getElementById('dateRange').addEventListener('change', loadDashboardData);
    document.getElementById('sortBy').addEventListener('change', loadDashboardData);
    
    // Refresh button
    document.getElementById('refreshData').addEventListener('click', () => {
        loadDashboardData();
    });
    
    // Table sorting
    document.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => sortTable(th));
    });
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('darkModeToggle').innerHTML = '<span class="icon">🌙</span>';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.getElementById('darkModeToggle').innerHTML = '<span class="icon">☀️</span>';
        localStorage.setItem('theme', 'light');
    }
    
    // Update Chart.js defaults for dark mode
    Chart.defaults.color = isDarkMode ? '#cbd5e1' : '#718096';
    Chart.defaults.borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Recreate charts with new theme
    if (currentData) {
        updateCharts(currentData);
    }
}

// Sort table by column
function sortTable(th) {
    const column = th.dataset.column;
    const tbody = document.getElementById('tableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Determine sort direction
    const isAscending = th.classList.contains('sorted-asc');
    
    // Remove all sort classes
    document.querySelectorAll('th.sortable').forEach(header => {
        header.classList.remove('sorted-asc', 'sorted-desc');
    });
    
    // Add appropriate sort class
    th.classList.add(isAscending ? 'sorted-desc' : 'sorted-asc');
    
    // Get column index
    const columnIndex = Array.from(th.parentElement.children).indexOf(th);
    
    // Sort rows
    rows.sort((a, b) => {
        let aValue = a.children[columnIndex].textContent;
        let bValue = b.children[columnIndex].textContent;
        
        // Remove commas and % signs for numeric comparison
        aValue = parseFloat(aValue.replace(/[,%]/g, '')) || aValue;
        bValue = parseFloat(bValue.replace(/[,%]/g, '')) || bValue;
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return isAscending ? bValue - aValue : aValue - bValue;
        } else {
            return isAscending ? 
                bValue.toString().localeCompare(aValue.toString()) :
                aValue.toString().localeCompare(bValue.toString());
        }
    });
    
    // Clear and repopulate tbody
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

// Update timestamp
function updateTimestamp() {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('lastUpdated').textContent = formatted;
}
