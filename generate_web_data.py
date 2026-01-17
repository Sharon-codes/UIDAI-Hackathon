
import pandas as pd
import json
import os
import re

# File paths
BASE_PATH = r"c:\Users\Samsung\OneDrive\Desktop\UIDAI"
# Use the V2 report if available, else standard
CSV_PATH = os.path.join(BASE_PATH, "district_pulse_report_v2.csv")
OUTPUT_PATH = os.path.join(BASE_PATH, "dashboard", "v2", "data.js")

# VALID INDIAN STATES WHITELIST
VALID_STATES = {
    'ANDAMAN AND NICOBAR ISLANDS', 'ANDHRA PRADESH', 'ARUNACHAL PRADESH', 'ASSAM', 'BIHAR', 
    'CHANDIGARH', 'CHHATTISGARH', 'DADRA AND NAGAR HAVELI AND DAMAN AND DIU', 'DELHI', 'GOA', 
    'GUJARAT', 'HARYANA', 'HIMACHAL PRADESH', 'JAMMU AND KASHMIR', 'JHARKHAND', 'KARNATAKA', 
    'KERALA', 'LADAKH', 'LAKSHADWEEP', 'MADHYA PRADESH', 'MAHARASHTRA', 'MANIPUR', 'MEGHALAYA', 
    'MIZORAM', 'NAGALAND', 'ODISHA', 'PUDUCHERRY', 'PUNJAB', 'RAJASTHAN', 'SIKKIM', 'TAMIL NADU', 
    'TELANGANA', 'TRIPURA', 'UTTAR PRADESH', 'UTTARAKHAND', 'WEST BENGAL'
}

# MAP COMMON TYPOS
STATE_MAPPING = {
    'WEST BANGAL': 'WEST BENGAL',
    'WEST BENGLI': 'WEST BENGAL',
    'WB': 'WEST BENGAL',
    'JAMMU & KASHMIR': 'JAMMU AND KASHMIR',
    'J&K': 'JAMMU AND KASHMIR',
    'CHHATISGARH': 'CHHATTISGARH',
    'ORISSA': 'ODISHA',
    'TELENGANA': 'TELANGANA',
    'PONDICHERRY': 'PUDUCHERRY',
    'ANDAMAN & NICOBAR': 'ANDAMAN AND NICOBAR ISLANDS',
    'DADRA & NAGAR HAVELI': 'DADRA AND NAGAR HAVELI AND DAMAN AND DIU',
}

def clean_state_name(name):
    if not isinstance(name, str): return "UNKNOWN"
    s = name.upper().strip()
    s = re.sub(r'[^A-Z& ]', '', s)
    s = re.sub(r'\s+', ' ', s)
    
    # 1. Direct Mapping
    if s in STATE_MAPPING:
        return STATE_MAPPING[s].title()
        
    # 2. Check Valid List
    if s in VALID_STATES:
        return s.title()
        
    # 3. Fuzzy / Partial Match (e.g. "ANDHRA PRAD")
    for valid in VALID_STATES:
        if s in valid or valid in s:
            return valid.title()
            
    # 4. If it's a district appearing as state (e.g. "BALANAGAR"), it won't match.
    return "DROP"

def clean_district_name(d_name):
    s = str(d_name).upper().strip()
    s = re.sub(r'[*]', '', s)
    return s.title()

def generate_web_data():
    if not os.path.exists(CSV_PATH):
        print(f"Error: {CSV_PATH} not found.")
        return

    df = pd.read_csv(CSV_PATH)
    
    # 1. Clean State Names
    df['state'] = df['state'].apply(clean_state_name)
    
    # 2. Drop Invalid States (fixes "Balanagar" issue)
    initial_count = len(df)
    df = df[df['state'] != "DROP"]
    print(f"Dropped {initial_count - len(df)} rows with invalid state names.")
    
    # 3. Clean District Names
    df['district'] = df['district'].apply(clean_district_name)
    
    # 4. Aggregate Duplicates (if any remain)
    cols = df.columns.tolist()
    agg_dict = {
        'erp_score': 'mean', 
        'icmp_score': 'mean', 
        'ami_score': 'mean',
        'last_mile_density': 'mean'
    }
    if 'ghost_flag' in cols: agg_dict['ghost_flag'] = 'max'
    
    df = df.groupby(['state', 'district'], as_index=False).agg(agg_dict)
    
    # 5. FAILSAFE NORMALIZATION (Fixing the 877.9 Score Issue)
    # We enforce 0-1 range for all scores.
    
    # ERP
    if df['erp_score'].max() > 1:
        df['erp_score'] = df['erp_score'] / df['erp_score'].max()
        
    # ICMP
    if df['icmp_score'].max() > 1:
        df['icmp_score'] = df['icmp_score'] / df['icmp_score'].max()
        
    # AMI (Critical Fix)
    # If AMI > 1, normalize it. If it was 0-100 placeholder, scale down.
    max_ami = df['ami_score'].max()
    if max_ami > 10: # Assuming it was meant to be 0-10 or 0-100
        df['ami_score'] = df['ami_score'] / max_ami
    elif max_ami > 1: # If it's 0-10, scale to 0-1
        df['ami_score'] = df['ami_score'] / 10
        
    # Final clip to be safe
    df['ami_score'] = df['ami_score'].clip(0, 1)
    
    # Last Mile Density
    if df['last_mile_density'].max() > 1:
        df['last_mile_density'] = df['last_mile_density'] / df['last_mile_density'].max()

    # 6. Export
    stats = {
        'total_districts': len(df),
        'total_states': len(df['state'].unique()),
        'avg_ami': round(df['ami_score'].mean() * 10, 1) # scaled to 10 for display
    }
    
    data_list = df.to_dict(orient='records')
    
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(f"window.AADHAAR_STATS = {json.dumps(stats)};\n")
        f.write(f"window.AADHAAR_DATA = {json.dumps(data_list)};\n")
    
    print(f"Data Generation Compelte. Districts: {len(df)}, States: {len(df['state'].unique())}")

if __name__ == "__main__":
    generate_web_data()
