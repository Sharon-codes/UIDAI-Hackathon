
// Analytics Engine for Aadhaar Pulse X

document.addEventListener('DOMContentLoaded', () => {
    // Wait for data to be loaded
    if (window.AADHAAR_DATA) {
        initAnalytics();
    } else {
        setTimeout(initAnalytics, 500);
    }
});

let analyticsCharts = {};

function initAnalytics() {
    console.log("Initializing Analytics Dashboard...");
    const districts = window.AADHAAR_DATA;

    populateStateFilter(districts);
    updatedashboard('All States Overview'); // Default view

    // Listener for filter
    document.getElementById('stateAnalyticsFilter').addEventListener('change', (e) => {
        updatedashboard(e.target.value);
    });

    // Initialize Deep Dive
    initDeepDiveExplorer();
}

function populateStateFilter(data) {
    // Filter out invalid states and sort alphabetically
    const states = [...new Set(data.map(d => d.state))]
        .filter(s => s && s !== 'DROP' && s !== 'UNKNOWN')
        .sort((a, b) => a.localeCompare(b));

    const select = document.getElementById('stateAnalyticsFilter');
    if (select) {
        select.innerHTML = '<option value="">All States Overview</option>';
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.innerText = state;
            select.appendChild(option);
        });
    }
}

function updatedashboard(stateFilter) {
    let data = window.AADHAAR_DATA;
    if (!data) return;

    let isStateView = (stateFilter === 'All States Overview' || stateFilter === '');

    if (isStateView) {
        // STATE LEVEL AGGREGATION
        const stateMap = new Map();

        data.forEach(d => {
            if (!stateMap.has(d.state)) {
                stateMap.set(d.state, {
                    district: d.state, // Display state name in the label
                    isState: true,
                    count: 0,
                    ami_score: 0,
                    erp_score: 0,
                    icmp_score: 0
                });
            }
            const s = stateMap.get(d.state);
            s.count++;
            s.ami_score += d.ami_score;
            s.erp_score += d.erp_score;
            s.icmp_score += d.icmp_score;
        });

        // Compute averages
        const stateData = Array.from(stateMap.values()).map(s => ({
            district: s.district, // Reuse 'district' key for chart compatibility
            state: s.district,
            ami_score: s.ami_score / s.count,
            erp_score: s.erp_score / s.count,
            icmp_score: s.icmp_score / s.count,
            isState: true
        }));

        // Remove 'DROP' or 'UNKNOWN' from state data if present
        const cleanStateData = stateData.filter(s => s.state !== 'DROP' && s.state !== 'UNKNOWN');

        // Use aggregated State data
        updateOverviewCards(cleanStateData, true);
        renderComparisonCharts(cleanStateData, true);
        updateDetailedTable(cleanStateData, true);

    } else {
        // DISTRICT LEVEL VIEW (Specific State)
        const districtData = data.filter(d => d.state === stateFilter);

        updateOverviewCards(districtData, false);
        renderComparisonCharts(districtData, false);
        updateDetailedTable(districtData, false);
    }
}

function updateOverviewCards(data, isStateLevel) {
    if (data.length === 0) return;

    // Calculate Averages
    const avgAMI = (data.reduce((acc, d) => acc + (d.ami_score * 10), 0) / data.length).toFixed(1);
    const avgERP = (data.reduce((acc, d) => acc + (d.erp_score * 100), 0) / data.length).toFixed(1);
    const avgICMP = (data.reduce((acc, d) => acc + (d.icmp_score * 100), 0) / data.length).toFixed(1);

    // Find Best/Worst Performing
    const best = data.reduce((prev, current) => (prev.ami_score > current.ami_score) ? prev : current);
    const worst = data.reduce((prev, current) => (prev.ami_score < current.ami_score) ? prev : current);

    const entityLabel = isStateLevel ? "States" : "Districts";
    const bestLabel = isStateLevel ? "Top Performing State" : "Top District";
    const worstLabel = isStateLevel ? "Lowest Performing State" : "Needs Attention";

    const container = document.getElementById('stateOverviewCards');
    if (!container) return;

    container.innerHTML = `
        <div class="overview-card">
            <h4>Average AMI Score</h4>
            <div class="big-number">${Math.min(avgAMI, 10).toFixed(1)}<small style="font-size:1rem;color:var(--text-dim)">/10</small></div>
            <div class="sub-text">Across ${data.length} ${entityLabel}</div>
        </div>
        <div class="overview-card">
            <h4>Avg Compliance (ERP)</h4>
            <div class="big-number">${avgERP}%</div>
            <div class="sub-text">Biometric Update Rate</div>
        </div>
        <div class="overview-card">
            <h4>Avg Migration (ICMP)</h4>
            <div class="big-number">${avgICMP}%</div>
            <div class="sub-text">Demographic Churn</div>
        </div>
        <div class="overview-card" style="border-color: #4ade80;">
            <h4 style="color:#4ade80">${bestLabel}</h4>
            <div class="big-number" style="font-size:1.4rem; color:#4ade80; margin-top:15px; margin-bottom:5px; line-height:1.2;">${best.district}</div>
            <div class="sub-text">AMI: ${(best.ami_score * 10).toFixed(1)}</div>
        </div>
        <div class="overview-card" style="border-color: #ff4b4b;">
            <h4 style="color:#ff4b4b">${worstLabel}</h4>
            <div class="big-number" style="font-size:1.4rem; color:#ff4b4b; margin-top:15px; margin-bottom:5px; line-height:1.2;">${worst.district}</div>
            <div class="sub-text">AMI: ${(worst.ami_score * 10).toFixed(1)}</div>
        </div>
    `;
}

function renderComparisonCharts(data, isStateLevel) {
    if (data.length === 0) return;

    // Helper to get Top/Bottom N
    const getTop = (key, n = 10) => [...data].sort((a, b) => b[key] - a[key]).slice(0, n);
    const getBottom = (key, n = 10) => [...data].sort((a, b) => a[key] - b[key]).slice(0, n);

    const labelSuffix = isStateLevel ? "States" : "Districts";

    // Update Titles dynamically
    document.querySelectorAll('.chart-card h4').forEach((el, index) => {
        const baseTitles = [
            `Top 10 ${labelSuffix} by AMI`,
            `Bottom 10 ${labelSuffix} by AMI`,
            `Best Compliance (ERP) ${labelSuffix}`,
            `Worst Compliance (ERP) ${labelSuffix}`,
            `Highest Migration (ICMP) ${labelSuffix}`,
            `Lowest Migration (ICMP) ${labelSuffix}`
        ];
        if (baseTitles[index]) el.innerText = baseTitles[index];
    });

    // 1. AMI Charts
    createBarChart('chartTopAMI', getTop('ami_score'), 'ami_score', 'AMI Score (0-10)', '#00f2ff', 10);
    createBarChart('chartBottomAMI', getBottom('ami_score'), 'ami_score', 'AMI Score (0-10)', '#ff4b4b', 10);

    // 2. ERP Charts
    createBarChart('chartTopERP', getTop('erp_score'), 'erp_score', 'Compliance %', '#4ade80', 100);
    createBarChart('chartBottomERP', getBottom('erp_score'), 'erp_score', 'Compliance %', '#ff8800', 100);

    // 3. ICMP Charts
    createBarChart('chartTopICMP', getTop('icmp_score'), 'icmp_score', 'Migration Velocity %', '#f59e0b', 100);
    createBarChart('chartBottomICMP', getBottom('icmp_score'), 'icmp_score', 'Migration Velocity %', '#94a3b8', 100);
}

function createBarChart(canvasId, dataset, key, label, color, multiplier) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Destroy existing if any
    if (analyticsCharts[canvasId]) {
        analyticsCharts[canvasId].destroy();
    }

    analyticsCharts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataset.map(d => d.district),
            datasets: [{
                label: label,
                data: dataset.map(d => (d[key] * multiplier).toFixed(1)),
                backgroundColor: color,
                borderRadius: 4,
                barThickness: 15
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    titleColor: '#fff',
                    bodyColor: '#ccc'
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#64748b' }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8', font: { size: 10 } }
                }
            }
        }
    });
}

function updateDetailedTable(data, isStateLevel) {
    const tbody = document.getElementById('districtTableBody');
    if (!tbody) return;

    const tableTitle = document.getElementById('stateDetailTable').querySelector('h3');
    const headerRow = document.querySelector('#districtTable thead tr');

    if (isStateLevel) {
        tableTitle.innerText = "All State Performance Rankings";
        headerRow.innerHTML = `
            <th>Rank</th>
            <th>State / UT</th>
            <th>Avg AMI Score</th>
            <th>Avg ERP</th>
            <th>Avg ICMP</th>
            <th>Status</th>
        `;
    } else {
        tableTitle.innerText = "District Performance Details";
        headerRow.innerHTML = `
            <th>Rank</th>
            <th>District</th>
            <th>AMI Score</th>
            <th>ERP</th>
            <th>ICMP</th>
            <th>Inclusion</th>
            <th>Integrity</th>
        `;
    }

    // Sort by AMI descending
    const sortedDetails = [...data].sort((a, b) => b.ami_score - a.ami_score);

    tbody.innerHTML = sortedDetails.map((d, index) => {
        const amiVal = (d.ami_score * 10).toFixed(1);
        const erpVal = (d.erp_score * 100).toFixed(1);
        const icmpVal = (d.icmp_score * 100).toFixed(1);

        if (isStateLevel) {
            return `
            <tr>
                <td style="color:${index < 3 ? 'var(--accent)' : 'inherit'}">#${index + 1}</td>
                <td style="font-weight:600; color:white;">${d.district}</td>
                <td>
                    <span style="background:${getScoreColor(amiVal)}; color:#000; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.8rem;">
                        ${amiVal}
                    </span>
                </td>
                <td>${erpVal}%</td>
                <td>${icmpVal}%</td>
                <td>
                    ${amiVal >= 7 ? '<span style="color:#4ade80">High Maturity</span>' :
                    amiVal >= 4 ? '<span style="color:#facc15">Developing</span>' :
                        '<span style="color:#ff4b4b">Critical Attention</span>'}
                </td>
            </tr>`;
        } else {
            return `
            <tr>
                <td style="color:${index < 3 ? 'var(--accent)' : 'inherit'}">#${index + 1}</td>
                <td style="font-weight:600; color:white;">${d.district}</td>
                <td>
                    <span style="background:${getScoreColor(amiVal)}; color:#000; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.8rem;">
                        ${amiVal}
                    </span>
                </td>
                <td>${erpVal}%</td>
                <td>${icmpVal}%</td>
                <td>${(Math.min(d.last_mile_density * 250, 100)).toFixed(1)}%</td>
                <td>
                    ${d.ghost_flag
                    ? '<span style="color:#ff4b4b"><i class="fas fa-exclamation-triangle"></i> Flagged</span>'
                    : '<span style="color:#4ade80"><i class="fas fa-check-circle"></i> Secure</span>'}
                </td>
            </tr>`;
        }
    }).join('');

    document.getElementById('stateDetailTable').classList.remove('hidden');
}

function getScoreColor(score) {
    if (score >= 7) return '#4ade80'; // Green
    if (score >= 4) return '#facc15'; // Yellow
    return '#ff4b4b'; // Red
}

/* =========================================
   DEEP DIVE EXPLORER LOGIC (REFINED with FutureCast)
   ========================================= */

let currentDistrictRecord = null;
let isFutureCastActive = false;

function initDeepDiveExplorer() {
    console.log("Initializing Deep Dive Explorer...");
    const data = window.AADHAAR_DATA;
    if (!data) return;

    // 1. Populate State Dropdown
    const states = [...new Set(data.map(d => d.state))]
        .filter(s => s && s !== 'DROP' && s !== 'UNKNOWN')
        .sort((a, b) => a.localeCompare(b));

    const stateSelect = document.getElementById('ddStateSelect');
    if (stateSelect) {
        stateSelect.innerHTML = '<option value="">Choose State...</option>';
        states.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.innerText = s;
            stateSelect.appendChild(opt);
        });

        // Listener
        stateSelect.addEventListener('change', (e) => {
            handleDeepDiveStateChange(e.target.value);
        });
    }

    // District Listener
    const districtSelect = document.getElementById('ddDistrictSelect');
    if (districtSelect) {
        districtSelect.addEventListener('change', (e) => {
            handleDeepDiveDistrictChange(e.target.value);
        });
    }

    // FutureCast Toggle Listener
    const futureToggle = document.getElementById('futureCastToggle');
    if (futureToggle) {
        futureToggle.addEventListener('change', (e) => {
            isFutureCastActive = e.target.checked;
            if (currentDistrictRecord) updateDeepDiveUI(currentDistrictRecord);
        });
    }

    // Report Download Listener
    const btnDownload = document.getElementById('btnDownloadReport');
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            if (currentDistrictRecord) downloadIntelligenceReport(currentDistrictRecord);
            else alert("Please select a district first.");
        });
    }
}

function handleDeepDiveStateChange(selectedState) {
    const districtSelect = document.getElementById('ddDistrictSelect');
    const districtDisplay = document.getElementById('districtDisplay');
    const actionsBar = document.getElementById('ddActions');

    // Reset
    districtSelect.innerHTML = '<option value="">Choose District...</option>';
    districtSelect.disabled = true;
    districtDisplay.classList.add('hidden');
    if (actionsBar) actionsBar.classList.add('hidden');

    if (!selectedState) return;

    // Filter Districts
    const districts = window.AADHAAR_DATA
        .filter(d => d.state === selectedState)
        .map(d => d.district)
        .sort((a, b) => a.localeCompare(b));

    // Populate
    districts.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.innerText = d;
        districtSelect.appendChild(opt);
    });

    districtSelect.disabled = false;
}

function handleDeepDiveDistrictChange(selectedDistrict) {
    const stateSelect = document.getElementById('ddStateSelect');
    const districtDisplay = document.getElementById('districtDisplay');
    const actionsBar = document.getElementById('ddActions');

    if (!selectedDistrict) {
        districtDisplay.classList.add('hidden');
        if (actionsBar) actionsBar.classList.add('hidden');
        currentDistrictRecord = null;
        return;
    }

    // Find Data
    currentDistrictRecord = window.AADHAAR_DATA.find(d =>
        d.state === stateSelect.value && d.district === selectedDistrict
    );

    if (!currentDistrictRecord) return;

    // Reset FutureCast on new selection
    isFutureCastActive = false;
    const toggle = document.getElementById('futureCastToggle');
    if (toggle) toggle.checked = false;

    // Update UI
    updateDeepDiveUI(currentDistrictRecord);

    // Show
    districtDisplay.classList.remove('hidden');
    if (actionsBar) actionsBar.classList.remove('hidden');
}

function updateDeepDiveUI(record) {
    // Apply FutureCast Logic if Active
    let ami = record.ami_score;
    let erp = record.erp_score;
    let icmp = record.icmp_score;
    let inclusion = Math.min(record.last_mile_density * 250, 100);

    if (isFutureCastActive) {
        // SIMULATION: "Trend w/o Intervention"
        // ERP gets worse (increases)
        erp = Math.min(erp * 1.5, 1.0);
        // AMI degrades
        ami = Math.max(ami * 0.85, 0);
        // ICMP increases slightly
        icmp = Math.min(icmp * 1.1, 1.0);
    }

    document.getElementById('d-name').innerText = record.district.toUpperCase();
    document.getElementById('d-state').innerText = record.state.toUpperCase();

    // AMI
    const amiVal = (ami * 10).toFixed(1);
    const amiEl = document.getElementById('d-ami');
    amiEl.innerText = amiVal;

    // Visual cue for prediction
    if (isFutureCastActive) {
        amiEl.style.color = "#ccc"; // Dimmed
        document.getElementById('d-name').innerHTML = `${record.district.toUpperCase()} <span style="font-size:1rem; color:var(--accent); vertical-align:middle; background:rgba(0,242,255,0.1); padding:4px 8px; border-radius:4px;">(PROJECTED 2026)</span>`;
    } else {
        amiEl.style.color = getScoreColor(amiVal);
    }

    // Metrics
    document.getElementById('erp-val').innerText = (erp * 100).toFixed(1) + "%";
    document.getElementById('icmp-val').innerText = (icmp * 100).toFixed(1) + "%";
    document.getElementById('inclusion-val').innerText = inclusion.toFixed(1) + "%";

    // Integrity
    const integrityEl = document.getElementById('ghost-val');
    if (record.ghost_flag) {
        integrityEl.innerText = "Anomaly Detected";
        integrityEl.style.color = "#ff4b4b";
    } else {
        integrityEl.innerText = "Secure";
        integrityEl.style.color = "#4ade80";
    }

    // Solution Brief
    const solutionDiv = document.getElementById('d-solution-detailed');
    solutionDiv.innerHTML = generateSolutionValues(record, isFutureCastActive, erp, icmp);
}

function generateSolutionValues(record, isFuture, erp, icmp) {
    let cards = [];

    // Helper for cards
    const createCard = (title, type, content, icon) => `
        <div class="strategy-card ${type}">
            <div class="strat-header"><i class="${icon}"></i> ${title}</div>
            <div class="strat-body">${content}</div>
        </div>
    `;

    // CATEGORY 1: EXCLUSION
    if (erp > 0.1) {
        const title = isFuture ? "PREDICTED CRISIS: Exclusion" : "CRITICAL: Exclusion Risk";
        const action = isFuture
            ? "<strong>Projection:</strong> Without intervention, exclusion rises to critical levels. <br><strong>Required:</strong> Pre-emptive saturated coverage plan."
            : "<strong>Action:</strong> Deploy mobile update vans to high-dropout wards immediately. Initiate 'Camp Mode'.";

        cards.push(createCard(title, "alert-high", `ERP: ${(erp * 100).toFixed(1)}%. ${action}`, "fas fa-user-minus"));
    } else {
        cards.push(createCard("Saturation Maintenance", "status-good", `Exclusion risk low. Maintain 0-5 age group focus.`, "fas fa-check-circle"));
    }

    // CATEGORY 2: MIGRATION
    if (icmp > 0.15) {
        const title = isFuture ? "FORECAST: Migration Surge" : "High Migration Velocity";
        cards.push(createCard(title, "alert-medium", `ICMP: ${(icmp * 100).toFixed(1)}%. Suggests heavy labor outflow. Activate ONORC support desks.`, "fas fa-plane-departure"));
    } else {
        cards.push(createCard("Stable Demographics", "status-neutral", `Migration flow stable. Prioritize steady-state updates.`, "fas fa-anchor"));
    }

    // CATEGORY 3: INTEGRITY
    if (record.ghost_flag) {
        cards.push(createCard("SECURITY ALERT: Anomaly", "alert-critical", `<strong>'Data Milling'</strong> signature detected. Suspend non-critical updates.`, "fas fa-shield-alt"));
    } else {
        cards.push(createCard("System Integrity", "status-good", `No anomalies detected. Operator trust score nominal.`, "fas fa-shield-check"));
    }

    return `<div class="strategy-grid">${cards.join('')}</div>`;
}

function downloadIntelligenceReport(record) {
    const date = new Date().toLocaleDateString();
    let content = `
UIDAI REGIONAL INTELLIGENCE BRIEF
---------------------------------
Generated: ${date}
District: ${record.district.toUpperCase()}
State: ${record.state.toUpperCase()}

CORE METRICS
---------------------------------
AMI Score (Maturity Index): ${(record.ami_score * 10).toFixed(1)} / 10
Exclusion Risk (ERP): ${(record.erp_score * 100).toFixed(1)}%
Migration Pulse (ICMP): ${(record.icmp_score * 100).toFixed(1)}%
Inclusion (18+): ${(Math.min(record.last_mile_density * 250, 100)).toFixed(1)}%
Integrity Status: ${record.ghost_flag ? "ANOMALY DETECTED [CRITICAL]" : "Secure"}

STRATEGIC ASSESSMENT
---------------------------------
1. Exclusion Analysis:
   ${record.erp_score > 0.1 ? "CRITICAL. High exclusion risk detected." : "Stable. Exclusion within tolerance."}

2. Migration Analysis:
   ${record.icmp_score > 0.15 ? "HIGH VELOCITY. Significant labor outflow indicated." : "Stable demographics."}

3. Integrity Audit:
   ${record.ghost_flag ? "ALERT: Data Milling patterns observed. Interactive audit recommended." : "System integrity nominal."}

RECOMMENDED ACTIONS
---------------------------------
- Deploy mobile vans to high-density wards (if ERP > 10%).
- Activate ONORC desks at transport hubs (if ICMP > 15%).
- Conduct operator audit (if Integrity Flagged).

---------------------------------
CONFIDENTIAL - FOR OFFICIAL USE ONLY
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Intelligence_Brief_${record.district}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
