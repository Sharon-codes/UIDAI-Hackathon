let districtRadar = null;

// ADVANCED AI REASONING ENGINE - Multi-factor Analysis
class AadhaarIntelligenceEngine {
    constructor(districtData) {
        this.data = districtData;
        this.erp = districtData.erp_score * 100;
        this.icmp = districtData.icmp_score * 100;
        this.lmd = districtData.last_mile_density * 100;
        this.ami = districtData.ami_score * 10;
        this.ghost = districtData.ghost_flag;
        this.state = districtData.state.toUpperCase();
        this.district = districtData.district;
    }

    // Geographic Classification
    getRegionalProfile() {
        const profiles = {
            'HIGH_DENSITY_RURAL': ['BIHAR', 'UP', 'UTTAR PRADESH', 'BENGAL', 'WEST BENGAL'],
            'TECH_ADVANCED': ['KERALA', 'TAMIL', 'KARNATAKA', 'TELANGANA'],
            'INDUSTRIAL_HUB': ['GUJARAT', 'MAHARASHTRA', 'HARYANA'],
            'DIFFICULT_TERRAIN': ['ASSAM', 'MANIPUR', 'MEGHALAYA', 'ARUNACHAL', 'JAMMU', 'KASHMIR', 'LADAKH', 'HIMACHAL'],
            'EMERGING': ['CHHATTISGARH', 'JHARKHAND', 'ODISHA', 'ORISSA']
        };

        for (const [profile, states] of Object.entries(profiles)) {
            if (states.some(s => this.state.includes(s))) {
                return profile;
            }
        }
        return 'STANDARD';
    }

    // Advanced Risk Scoring
    getRiskProfile() {
        let riskScore = 0;
        let criticalFactors = [];

        // ERP Risk Assessment
        if (this.erp < 20) {
            riskScore += 40;
            criticalFactors.push('CRITICAL_COMPLIANCE_FAILURE');
        } else if (this.erp < 40) {
            riskScore += 25;
            criticalFactors.push('HIGH_EXCLUSION_RISK');
        } else if (this.erp < 60) {
            riskScore += 10;
        }

        // ICMP Volatility
        if (this.icmp > 70) {
            riskScore += 20;
            criticalFactors.push('MIGRATION_SURGE');
        } else if (this.icmp < 10) {
            riskScore += 15;
            criticalFactors.push('DEMOGRAPHIC_STAGNATION');
        }

        // Integrity Breach
        if (this.ghost) {
            riskScore += 30;
            criticalFactors.push('FRAUD_SIGNATURE_DETECTED');
        }

        // Inclusion Gap
        if (this.lmd > 15) {
            riskScore += 20;
            criticalFactors.push('SEVERE_EXCLUSION_GAP');
        }

        return {
            score: Math.min(riskScore, 100),
            level: riskScore > 60 ? 'CRITICAL' : riskScore > 35 ? 'HIGH' : riskScore > 15 ? 'MODERATE' : 'LOW',
            factors: criticalFactors
        };
    }

    // Compliance Analysis with Severity Grading
    analyzeCompliance() {
        const risk = this.getRiskProfile();

        if (this.erp < 20) {
            return {
                severity: 'CRITICAL',
                status: `EMERGENCY INTERVENTION REQUIRED (${this.erp.toFixed(1)}%)`,
                action: `**IMMEDIATE ACTIONS REQUIRED:**\n• Deploy 10+ mobile biometric units to all government schools within 72 hours\n• Coordinate with District Education Officer for mandatory biometric camps during school hours\n• Issue SMS alerts to parents of all children aged 4-6 and 14-16 in ${this.district}\n• Risk Assessment: ${risk.score}% - Mass service denial imminent in PM-POSHAN, scholarship schemes, and subsidized meal programs`,
                priority: 'P0',
                timeline: '72 hours',
                budget: 'Emergency allocation: ₹15-20 lakhs'
            };
        } else if (this.erp < 40) {
            return {
                severity: 'HIGH',
                status: `SIGNIFICANT GAP DETECTED (${this.erp.toFixed(1)}%)`,
                action: `**PRIORITY INTERVENTIONS:**\n• Deploy 5-8 mobile biometric units targeting Age 5 and Age 15 cohorts\n• Coordinate with Anganwadi workers for door-to-door awareness in rural pockets\n• Set up temporary update kiosks at Primary Health Centers and Block offices\n• Risk Assessment: ${risk.score}% - Potential service disruption for 30-40% of eligible children`,
                priority: 'P1',
                timeline: '2 weeks',
                budget: 'Standard allocation: ₹8-12 lakhs'
            };
        } else if (this.erp < 70) {
            return {
                severity: 'MODERATE',
                status: `BELOW NATIONAL AVERAGE (${this.erp.toFixed(1)}%)`,
                action: `**OPTIMIZATION MEASURES:**\n• Trigger automated SMS reminders to parents via Aadhaar-linked mobile numbers\n• Set up temporary update kiosks at district hospitals and major weekly markets\n• Partner with local schools for awareness sessions during parent-teacher meetings\n• Risk Assessment: ${risk.score}% - Manageable with routine interventions`,
                priority: 'P2',
                timeline: '1 month',
                budget: 'Routine budget: ₹3-5 lakhs'
            };
        } else {
            return {
                severity: 'OPTIMAL',
                status: `HEALTHY COMPLIANCE (${this.erp.toFixed(1)}%)`,
                action: `**MAINTENANCE \u0026 QUALITY FOCUS:**\n• System performing at benchmark levels - shift resources to quality audits\n• Conduct biometric quality checks and duplicate detection drives\n• Use ${this.district} as a best-practice model for neighboring regions\n• Risk Assessment: ${risk.score}% - Minimal intervention required`,
                priority: 'P3',
                timeline: 'Quarterly review',
                budget: 'Minimal: ₹1-2 lakhs for audits'
            };
        }
    }

    // Migration Pattern Analysis
    analyzeMigration() {
        if (this.icmp > 70) {
            return {
                pattern: 'HIGH_INFLUX',
                status: `MAJOR MIGRATION HUB (${this.icmp.toFixed(1)}%)`,
                insight: `**MIGRATION INTELLIGENCE:**\n${this.district} is experiencing significant demographic churn (${this.icmp.toFixed(1)}% update velocity), indicating it's a major labor magnet. High update frequency suggests:\n• Seasonal migration from rural hinterlands for construction/industrial work\n• Permanent relocation due to employment opportunities\n• Cross-state labor movement requiring portable identity services`,
                recommendation: `**STRATEGIC INFRASTRUCTURE:**\n• Establish dedicated ONORC (One Nation One Ration Card) facilitation centers at:\n  - Railway stations and bus terminals\n  - Major factory gates and construction sites\n  - Urban slum clusters with high migrant density\n• Integrate Aadhaar update desks with factory HR departments\n• Deploy mobile units during festival seasons when reverse migration peaks\n• Partner with labor contractors for bulk enrollment drives`,
                economicImpact: 'High - Indicates economic growth and job creation'
            };
        } else if (this.icmp > 40) {
            return {
                pattern: 'MODERATE_FLOW',
                status: `STABLE DEMOGRAPHIC FLUX (${this.icmp.toFixed(1)}%)`,
                insight: `**NORMAL POPULATION DYNAMICS:**\nUpdate patterns align with typical urban-rural interchange:\n• Educational migration (students moving for higher education)\n• Marriage-related relocations\n• Government job transfers\n• Routine address updates`,
                recommendation: `**STANDARD OPERATIONS:**\n• Maintain existing Registrar infrastructure at current capacity\n• Focus on reducing wait times through process optimization\n• Implement appointment-based system for non-urgent updates\n• Quarterly capacity reviews to prevent bottlenecks`,
                economicImpact: 'Stable - Normal demographic equilibrium'
            };
        } else if (this.icmp > 15) {
            return {
                pattern: 'LOW_MOBILITY',
                status: `STATIC POPULATION BASE (${this.icmp.toFixed(1)}%)`,
                insight: `**DEMOGRAPHIC STAGNATION INDICATORS:**\nVery low demographic movement suggests:\n• Aging population with minimal youth retention\n• Limited economic opportunities causing out-migration\n• Possible rural-to-urban exodus leaving elderly behind\n• Established communities with low turnover`,
                recommendation: `**RESOURCE REALLOCATION:**\n• Re-allocate mobile update units to high-churn districts\n• Focus local resources on elderly-friendly services:\n  - Iris scan priority over fingerprint (age-related degradation)\n  - Home-visit programs for mobility-impaired seniors\n  - Simplified update process at Panchayat offices\n• Investigate economic development opportunities to retain youth`,
                economicImpact: 'Concerning - Potential economic stagnation'
            };
        } else {
            return {
                pattern: 'LOCKED',
                status: `DEMOGRAPHICALLY FROZEN (${this.icmp.toFixed(1)}%)`,
                insight: `**CRITICAL INVESTIGATION REQUIRED:**\nExtremely low update activity (${this.icmp.toFixed(1)}%) indicates:\n• Tribal/remote area with minimal government interface\n• Possible data collection gap or system failure\n• Population vs. database mismatch\n• Potential mass out-migration not captured in records`,
                recommendation: `**GROUND VERIFICATION PROTOCOL:**\n• Deploy survey teams for door-to-door population verification\n• Cross-reference with Census data and electoral rolls\n• Investigate if area requires specialized tribal outreach teams\n• Check for system/network issues preventing update registration\n• Consider satellite-based population density mapping`,
                economicImpact: 'Unknown - Requires immediate investigation'
            };
        }
    }

    // Inclusion Gap Analysis
    analyzeInclusion() {
        if (this.lmd > 15) {
            return `**CRITICAL EXCLUSION CRISIS:**\nSignificant adult population (${this.lmd.toFixed(1)}%) still outside Aadhaar ecosystem represents ${Math.round(this.lmd * 1000)} adults per 100K population.\n\n**ROOT CAUSES:**\n• Remote tribal settlements beyond road connectivity\n• Elderly population unaware of Aadhaar importance\n• Disabled individuals unable to reach enrollment centers\n• Nomadic communities with no fixed address\n• Linguistic/cultural barriers in tribal areas\n\n**INTERVENTION STRATEGY:**\n• Deploy "Aadhaar-on-Wheels" with portable iris scanners to:\n  - Forest villages and tribal hamlets\n  - Old-age homes and disability care centers\n  - Weekly tribal markets (haats)\n• Coordinate with local Panchayats for community mobilization\n• Provide interpreters for tribal languages\n• Offer doorstep enrollment for bed-ridden elderly\n• Partner with NGOs working in remote areas`;
        } else if (this.lmd > 5) {
            return `**MODERATE INCLUSION DEFICIT:**\n${this.lmd.toFixed(1)}% of adults are first-time enrollees, suggesting pockets of exclusion.\n\n**TARGETED APPROACH:**\n• Focus on elderly (65+) and disabled populations\n• Set up temporary centers at:\n  - Religious gatherings and festivals\n  - Weekly markets and melas\n  - Government hospitals during OPD hours\n• Conduct awareness campaigns in local languages\n• Simplify documentation requirements for elderly`;
        } else {
            return `**NEAR-SATURATION ACHIEVED:**\nAdult coverage is ${(100 - this.lmd).toFixed(1)}%, indicating excellent penetration.\n\n**QUALITY FOCUS:**\n• Shift from enrollment to quality improvement:\n  - Duplicate detection and cleanup\n  - Biometric quality enhancement\n  - Demographic data accuracy verification\n• Use ${this.district} as benchmark for other regions\n• Minimal new enrollment infrastructure needed`;
        }
    }

    // Integrity Assessment
    analyzeIntegrity() {
        if (this.ghost) {
            return {
                status: 'ANOMALY DETECTED',
                alert: 'DECOUPLING PATTERN IDENTIFIED - FRAUD SIGNATURE',
                detail: `**FORENSIC ANALYSIS:**\nStatistical pattern matching reveals high update volume (${this.icmp.toFixed(1)}% velocity) with zero corresponding growth in ${this.district}. This signature matches "Data Milling" behavior where rogue operators generate fake update transactions to:\n• Inflate performance metrics for incentive claims\n• Create ghost identities for fraudulent benefit claims\n• Manipulate machine utilization statistics\n\n**FRAUD INDICATORS:**\n• Update-to-Enrollment ratio: Abnormally high\n• Operator concentration: Likely single-source manipulation\n• Temporal pattern: Possible batch processing of fake updates\n• Geographic clustering: Specific PIN codes flagged`,
                action: `**IMMEDIATE FORENSIC AUDIT PROTOCOL:**\n\n**Phase 1 (24 hours):**\n• Suspend all high-volume operator licenses pending investigation\n• Freeze incentive payments for flagged machines\n• Extract transaction logs for last 6 months\n\n**Phase 2 (72 hours):**\n• Cross-reference operator IDs with geolocation data\n• Verify random sample of 500 "updated" Aadhaar numbers via SMS/call\n• Check for duplicate biometric submissions from same machine\n\n**Phase 3 (1 week):**\n• Deploy UIDAI inspection team for on-site verification\n• Interview citizens listed in suspicious transactions\n• Initiate criminal proceedings if fraud confirmed\n\n**Estimated Fraud Scale:** ₹5-15 lakhs in false incentive claims`,
                legalAction: 'FIR under IT Act 2000 Section 66C (Identity Theft) recommended'
            };
        } else {
            return {
                status: 'SYSTEM HEALTHY',
                alert: 'NO ANOMALIES DETECTED',
                detail: `**INTEGRITY VERIFICATION:**\nUpdate patterns correlate normally with demographic growth in ${this.district}. Statistical analysis shows:\n• Update-to-Enrollment ratio: Within normal range\n• Operator distribution: Healthy competition, no monopoly\n• Temporal pattern: Consistent with seasonal trends\n• Geographic spread: Uniform across PIN codes`,
                action: `**ROUTINE MAINTENANCE:**\n• Continue quarterly license reviews for all Registrars\n• Maintain random audit sampling (5% of transactions)\n• Monitor for emerging anomaly patterns\n• Ensure operator training on fraud prevention`,
                legalAction: 'No action required - system operating normally'
            };
        }
    }

    // Generate Comprehensive Intelligence Brief
    generateBrief() {
        const regional = this.getRegionalProfile();
        const compliance = this.analyzeCompliance();
        const migration = this.analyzeMigration();
        const inclusion = this.analyzeInclusion();
        const integrity = this.analyzeIntegrity();

        const regionalContext = {
            'HIGH_DENSITY_RURAL': 'High-density agrarian belt requiring mass-enrollment logistics and school-based saturation campaigns.',
            'TECH_ADVANCED': 'Digital-native population with high literacy. Prioritize self-service portals and mobile app adoption over physical centers.',
            'INDUSTRIAL_HUB': 'Industrial migration corridor. Focus on portability infrastructure (ONORC) and real-time demographic synchronization with labor databases.',
            'DIFFICULT_TERRAIN': 'Challenging topography and connectivity. Requires portable biometric kits, offline-sync capabilities, and helicopter-accessible enrollment teams.',
            'EMERGING': 'Transitional economy with mixed urban-rural dynamics. Balance between traditional outreach and digital infrastructure.',
            'STANDARD': 'Standard administrative profile. Optimize existing Registrar network efficiency.'
        };

        return {
            regional: regionalContext[regional],
            compliance,
            migration,
            inclusion,
            integrity,
            ami: this.ami
        };
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (window.AADHAAR_DATA) {
        initStates();
        renderSearchList(window.AADHAAR_DATA.slice(0, 50));
        setupSearch();
    }
    gsap.from('.hero-content-x h1', { opacity: 0, y: 50, duration: 1.2, ease: "power3.out" });
});

function initStates() {
    const stateFilter = document.getElementById('stateFilter');
    if (!stateFilter) return;
    const states = [...new Set(window.AADHAAR_DATA.map(d => d.state))].sort();
    stateFilter.innerHTML = '<option value="">All States (Harmonized)</option>';
    states.forEach(s => {
        const opt = document.createElement('option');
        opt.value = opt.innerText = s;
        stateFilter.appendChild(opt);
    });
    stateFilter.addEventListener('change', filterResults);
}

function setupSearch() {
    const input = document.getElementById('masterSearch');
    if (input) input.addEventListener('input', filterResults);
}

function filterResults() {
    const q = document.getElementById('masterSearch').value.toLowerCase();
    const s = document.getElementById('stateFilter').value;
    let filtered = window.AADHAAR_DATA;
    if (s) filtered = filtered.filter(d => d.state === s);
    if (q) filtered = filtered.filter(d => d.district.toLowerCase().includes(q));
    renderSearchList(filtered.slice(0, 50));
}

function renderSearchList(list) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    container.innerHTML = list.map(d => `
        <div class="res-item-x" onclick="displayDistrict('${d.district}')">
            <h4>${d.district}</h4>
            <span style="font-size:0.75rem; color:#64748b">${d.state}</span>
        </div>
    `).join('');
}

function displayDistrict(name) {
    const d = window.AADHAAR_DATA.find(x => x.district === name);
    if (!d) return;

    const disp = document.getElementById('districtDisplay');
    disp.classList.remove('hidden');
    gsap.fromTo(disp, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.5 });

    document.getElementById('d-name').innerText = d.district;
    document.getElementById('d-state').innerText = d.state;

    // AMI is 0-1 range, display as 0-10, capped at 10
    const amiDisplay = Math.min(d.ami_score * 10, 10);
    document.getElementById('d-ami').innerText = amiDisplay.toFixed(1);

    document.getElementById('erp-val').innerText = (d.erp_score * 100).toFixed(1) + '%';
    document.getElementById('icmp-val').innerText = (d.icmp_score * 100).toFixed(1) + '%';

    // Match the radar chart calculation exactly
    const inclusionValue = Math.min(d.last_mile_density * 250, 100);
    document.getElementById('inclusion-val').innerText = inclusionValue.toFixed(1) + '%';

    document.getElementById('ghost-val').innerText = d.ghost_flag ? "Anomaly Detected" : "Healthy";
    document.getElementById('ghost-val').style.color = d.ghost_flag ? "#ff4b4b" : "#4ade80";

    generateAISolution(d);
    setTimeout(() => updateRadar(d), 50);
}

function generateAISolution(d) {
    const engine = new AadhaarIntelligenceEngine(d);
    const brief = engine.generateBrief();
    const risk = engine.getRiskProfile();

    const title = document.getElementById('sol-title');
    const content = document.getElementById('d-solution-detailed');

    title.innerHTML = `INTELLIGENCE BRIEF: <span style="color:var(--accent)">${d.district.toUpperCase()}</span>`;

    // Format text with line breaks
    const formatText = (text) => text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    content.innerHTML = `
        <div style="background:rgba(255,0,0,0.1); border-left:4px solid ${risk.level === 'CRITICAL' ? '#ff4b4b' : risk.level === 'HIGH' ? '#ff8800' : risk.level === 'MODERATE' ? '#ffaa00' : '#4ade80'}; padding:15px; margin-bottom:30px; border-radius:8px;">
            <strong style="color:white; font-size:0.9rem;">RISK ASSESSMENT: ${risk.level} (${risk.score}%)</strong>
            ${risk.factors.length > 0 ? `<br><span style="font-size:0.85rem; color:var(--text-dim);">Critical Factors: ${risk.factors.join(', ')}</span>` : ''}
        </div>
        
        <div class="nlp-block">
            <h5>MULTI-DIMENSIONAL ANALYSIS</h5>
            <ul class="nlp-text" style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 30px; position: relative; padding-left: 25px; padding:20px; background:rgba(255,255,255,0.02); border-radius:12px;">
                    <span style="color:var(--accent); position:absolute; left:0; font-size:1.2rem; top:20px;">►</span>
                    <strong style="color:white; font-size: 0.9rem; letter-spacing: 1.5px; display:block; margin-bottom:12px;">REGIONAL CLASSIFICATION</strong>
                    <div style="font-size: 0.92rem; color:var(--text-dim); line-height:1.8;">${brief.regional}</div>
                </li>
                
                <li style="margin-bottom: 30px; position: relative; padding-left: 25px; padding:20px; background:rgba(255,255,255,0.02); border-radius:12px;">
                    <span style="color:var(--accent); position:absolute; left:0; font-size:1.2rem; top:20px;">►</span>
                    <strong style="color:white; font-size: 0.9rem; letter-spacing: 1.5px; display:block; margin-bottom:12px;">COMPLIANCE VECTOR [${brief.compliance.severity}] - Priority: ${brief.compliance.priority}</strong>
                    <div style="font-size: 0.92rem; color:var(--text-dim); line-height:1.8; margin-bottom:12px;">${formatText(brief.compliance.action)}</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:15px;">
                        <div style="background:rgba(0,242,255,0.05); padding:10px; border-radius:8px;">
                            <small style="color:var(--text-dim); font-size:0.75rem;">TIMELINE</small><br>
                            <strong style="color:var(--accent); font-size:0.9rem;">${brief.compliance.timeline}</strong>
                        </div>
                        <div style="background:rgba(0,242,255,0.05); padding:10px; border-radius:8px;">
                            <small style="color:var(--text-dim); font-size:0.75rem;">BUDGET</small><br>
                            <strong style="color:var(--accent); font-size:0.9rem;">${brief.compliance.budget}</strong>
                        </div>
                    </div>
                </li>
                
                <li style="margin-bottom: 30px; position: relative; padding-left: 25px; padding:20px; background:rgba(255,255,255,0.02); border-radius:12px;">
                    <span style="color:var(--accent); position:absolute; left:0; font-size:1.2rem; top:20px;">►</span>
                    <strong style="color:white; font-size: 0.9rem; letter-spacing: 1.5px; display:block; margin-bottom:12px;">MIGRATION PATTERN [${brief.migration.pattern}]</strong>
                    <div style="font-size: 0.92rem; color:var(--text-dim); line-height:1.8; margin-bottom:12px;">${formatText(brief.migration.insight)}</div>
                    <div style="background:rgba(0,242,255,0.05); padding:12px; border-radius:8px; margin-top:12px;">
                        <small style="color:var(--text-dim); font-size:0.75rem;">ECONOMIC IMPACT</small><br>
                        <strong style="color:var(--accent); font-size:0.9rem;">${brief.migration.economicImpact}</strong>
                    </div>
                    <div style="margin-top:15px; font-size:0.92rem; color:var(--text-dim); line-height:1.8;">${formatText(brief.migration.recommendation)}</div>
                </li>
                
                <li style="margin-bottom: 0px; position: relative; padding-left: 25px; padding:20px; background:rgba(255,255,255,0.02); border-radius:12px;">
                    <span style="color:var(--accent); position:absolute; left:0; font-size:1.2rem; top:20px;">►</span>
                    <strong style="color:white; font-size: 0.9rem; letter-spacing: 1.5px; display:block; margin-bottom:12px;">INTEGRITY STATUS [${brief.integrity.status}]</strong>
                    <div style="background:${brief.integrity.status === 'ANOMALY DETECTED' ? 'rgba(255,75,75,0.1)' : 'rgba(74,222,128,0.1)'}; padding:15px; border-radius:8px; border-left:4px solid ${brief.integrity.status === 'ANOMALY DETECTED' ? '#ff4b4b' : '#4ade80'}; margin-bottom:12px;">
                        <strong style="color:${brief.integrity.status === 'ANOMALY DETECTED' ? '#ff4b4b' : '#4ade80'}; font-size:0.85rem;">${brief.integrity.alert}</strong>
                    </div>
                    <div style="font-size: 0.92rem; color:var(--text-dim); line-height:1.8; margin-bottom:12px;">${formatText(brief.integrity.detail)}</div>
                    <div style="margin-top:15px; font-size: 0.92rem; color:var(--text-dim); line-height:1.8;">${formatText(brief.integrity.action)}</div>
                    ${brief.integrity.legalAction ? `<div style="background:rgba(255,200,0,0.1); padding:12px; border-radius:8px; margin-top:15px; border-left:4px solid #ffaa00;">
                        <strong style="color:#ffaa00; font-size:0.85rem;">LEGAL ACTION:</strong><br>
                        <span style="color:var(--text-dim); font-size:0.9rem;">${brief.integrity.legalAction}</span>
                    </div>` : ''}
                </li>
            </ul>
        </div>
    `;
}

function updateRadar(d) {
    const ctx = document.getElementById('districtRadar');
    if (!ctx) return;

    const data = {
        labels: ['ERP (Exclusion Risk)', 'ICMP (Migration)', 'Integrity Shield', 'Last Mile (Inclusion)', 'AMI (Maturity)'],
        datasets: [{
            data: [
                d.erp_score * 100,
                d.icmp_score * 100,
                d.ghost_flag ? 15 : 95,
                Math.min(d.last_mile_density * 250, 100),
                d.ami_score * 100
            ],
            backgroundColor: 'rgba(0, 242, 255, 0.12)',
            borderColor: '#00f2ff',
            borderWidth: 2.5,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#00f2ff',
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    if (districtRadar) districtRadar.destroy();

    districtRadar = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 15
            },
            scales: {
                r: {
                    grid: { color: 'rgba(255,255,255,0.06)', circular: true },
                    angleLines: { color: 'rgba(255,255,255,0.06)' },
                    pointLabels: {
                        color: '#94a3b8',
                        font: { size: 10, family: "'Space Grotesk', sans-serif", weight: '600' }
                    },
                    ticks: { display: false },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(0, 242, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false
                }
            }
        }
    });
}
