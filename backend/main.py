from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.models import RunSizingRequest, RunSizingResponse, TrendPoint
from backend.services.place_mapper import get_region_from_place
from backend.services.lookup_service import (
    load_lookup_table,
    interpolate_lookup,
    load_peak_table,
    interpolate_peak_lookup,
)
from backend.services.transformer_service import size_transformer_cf

app = FastAPI(title="VoltSizer Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "VoltSizer backend is running."}


@app.post("/api/run-sizing", response_model=RunSizingResponse)
def run_sizing(payload: RunSizingRequest):
    try:
        region_type = get_region_from_place(payload.place)

        n_total = int(payload.residential_units)
        n_per_phase = n_total / 3.0

        lookup_df = load_lookup_table(region_type)

        # Three-phase correction:
        # ADMD, DF and CF are selected using units per phase.
        # Example: 150 total units -> 50 units per phase.
        lookup_result = interpolate_lookup(lookup_df, n_per_phase)

        trend_points = [
            TrendPoint(
                N=int(row["N"]),
                ADMD_kW_per_unit=float(row["ADMD_kW_per_household"]),
                DF=float(row["DF"]),
                CF=float(row["CF"]),
            )
            for _, row in lookup_df.iterrows()
        ]

        peak_df = load_peak_table(region_type)

        # Peak lookup still uses the total number of residential units.
        # Example: 150 total units -> use max total peak for 150 units.
        peak_result = interpolate_peak_lookup(peak_df, n_total)

        transformer_result = size_transformer_cf(
            max_total_peak_kw=peak_result["max_total_peak_kW"],
            coincidence_factor=lookup_result["CF"],
            power_factor=payload.power_factor,
            margin=payload.margin,
        )

        return RunSizingResponse(
            place=payload.place,
            region_type=region_type,
            residential_units=n_total,
            residential_units_per_phase=n_per_phase,
            diversity_lookup_units_per_phase=n_per_phase,
            peak_lookup_units_total=n_total,
            ADMD_kW_per_unit=lookup_result["ADMD_kW_per_unit"],
            DF=lookup_result["DF"],
            CF=lookup_result["CF"],
            max_total_peak_kW=transformer_result["max_total_peak_kW"],
            group_peak_kW=transformer_result["group_peak_kW"],
            required_kVA=transformer_result["required_kVA"],
            design_kVA=transformer_result["design_kVA"],
            selected_transformer_kVA=transformer_result["selected_transformer_kVA"],
            phase_balance_note=(
                "Three-phase sizing mode: ADMD, CF and DF are taken using "
                "units per phase (total units divided by 3), while maximum "
                "peak demand is taken using the total number of units. "
                "Households should be distributed across phases as evenly as possible."
            ),
            trend_points=trend_points,
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected backend error: {e}")
