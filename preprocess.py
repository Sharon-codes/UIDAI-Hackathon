import pandas as pd
import glob
import os

def load_and_clean(folder_path, prefix):
    print(f"Loading {prefix} data from {folder_path}...")
    files = glob.glob(os.path.join(folder_path, "*.csv"))
    df_list = []
    for f in files:
        temp_df = pd.read_csv(f)
        df_list.append(temp_df)
    
    df = pd.concat(df_list, ignore_index=True)
    # Standardize column names
    df.columns = [c.strip().lower() for c in df.columns]
    
    # Ensure date is datetime
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], dayfirst=True, errors='coerce')
    
    # Handle missing/NaN in counts by filling with 0
    count_cols = [c for c in df.columns if any(x in c for x in ['age', 'bio', 'demo'])]
    df[count_cols] = df[count_cols].fillna(0).astype(int)
    
    return df

def main():
    base_path = r"c:\Users\Samsung\OneDrive\Desktop\UIDAI"
    enrol_path = os.path.join(base_path, "api_data_aadhar_enrolment")
    bio_path = os.path.join(base_path, "api_data_aadhar_biometric")
    demo_path = os.path.join(base_path, "api_data_aadhar_demographic")
    
    df_enrol = load_and_clean(enrol_path, "Enrolment")
    df_bio = load_and_clean(bio_path, "Biometric")
    df_demo = load_and_clean(demo_path, "Demographic")
    
    print("Merging datasets...")
    # Merge keys: date, state, district, pincode
    # Note: Enrolment has 'pincode', others might have it too.
    merge_keys = ['date', 'state', 'district', 'pincode']
    
    # Outer merge to ensure no data is lost
    master_df = pd.merge(df_enrol, df_bio, on=merge_keys, how='outer')
    master_df = pd.merge(master_df, df_demo, on=merge_keys, how='outer')
    
    # Fill NA again after merge for columns that didn't exist in all datasets
    master_df = master_df.fillna(0)
    
    # Basic Validation
    print(f"Master dataset shape: {master_df.shape}")
    print(f"Columns: {master_df.columns.tolist()}")
    
    output_path = os.path.join(base_path, "aadhaar_master_cleaned.csv")
    master_df.to_csv(output_path, index=False)
    print(f"Saved cleaned master data to {output_path}")

if __name__ == "__main__":
    main()
