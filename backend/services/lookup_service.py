from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[2]

LOOKUP_FILES = {
    "city": BASE_DIR / "lookup_tables_output" / "lookup_table_city_slim.csv",
    "town": BASE_DIR / "lookup_tables_output" / "lookup_table_town_slim.csv",
    "village": BASE_DIR / "lookup_tables_output" / "lookup_table_village_slim.csv",
}

PEAK_FILES = {
    "city": BASE_DIR / "household_peak_tables_output" / "household_peak_lookup_city.csv",
    "town": BASE_DIR / "household_peak_tables_output" / "household_peak_lookup_town.csv",
    "village": BASE_DIR / "household_peak_tables_output" / "household_peak_lookup_village.csv",
}


def load_lookup_table(region_type: str) -> pd.DataFrame:
    file_path = LOOKUP_FILES.get(region_type)
    if file_path is None:
        raise ValueError(f"No lookup file configured for region '{region_type}'")
    if not file_path.exists():
        raise FileNotFoundError(f"Lookup table not found: {file_path}")

    df = pd.read_csv(file_path)
    df.columns = df.columns.str.strip()

    required = {"N", "ADMD_kW_per_household", "DF", "CF"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Lookup table missing columns: {missing}")

    return df.sort_values("N").reset_index(drop=True)


def load_peak_table(region_type: str) -> pd.DataFrame:
    file_path = PEAK_FILES.get(region_type)
    if file_path is None:
        raise ValueError(f"No peak lookup file configured for region '{region_type}'")
    if not file_path.exists():
        raise FileNotFoundError(f"Peak lookup table not found: {file_path}")

    df = pd.read_csv(file_path)
    df.columns = df.columns.str.strip()

    required = {"N_households", "max_total_peak_kW"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Peak lookup table missing columns: {missing}")

    return df.sort_values("N_households").reset_index(drop=True)


def _interpolate(df: pd.DataFrame, x_col: str, y_col: str, x_value: int) -> float:
    exact = df[df[x_col] == x_value]
    if not exact.empty:
        return float(exact.iloc[0][y_col])

    if x_value < df[x_col].min():
        return float(df.iloc[0][y_col])

    if x_value > df[x_col].max():
        return float(df.iloc[-1][y_col])

    lower = df[df[x_col] < x_value].iloc[-1]
    upper = df[df[x_col] > x_value].iloc[0]

    x1 = float(lower[x_col])
    x2 = float(upper[x_col])
    x = float(x_value)

    y1 = float(lower[y_col])
    y2 = float(upper[y_col])

    return y1 + (y2 - y1) * ((x - x1) / (x2 - x1))


def interpolate_lookup(df: pd.DataFrame, n_units: int) -> dict:
    return {
        "ADMD_kW_per_unit": _interpolate(df, "N", "ADMD_kW_per_household", n_units),
        "DF": _interpolate(df, "N", "DF", n_units),
        "CF": _interpolate(df, "N", "CF", n_units),
    }


def interpolate_peak_lookup(df: pd.DataFrame, n_units: int) -> dict:
    return {
        "max_total_peak_kW": _interpolate(df, "N_households", "max_total_peak_kW", n_units)
    }