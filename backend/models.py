from pydantic import BaseModel, Field


class RunSizingRequest(BaseModel):
    place: str = Field(..., example="Gaborone")
    residential_units: int = Field(..., gt=0, le=720, example=150)
    power_factor: float = Field(0.9, gt=0.0, le=1.0, example=0.9)
    margin: float = Field(0.2, ge=0.0, le=1.0, example=0.2)


class TrendPoint(BaseModel):
    # N represents the lookup-table household count.
    # In the final three-phase sizing logic, ADMD/DF/CF are read using units per phase.
    N: int
    ADMD_kW_per_unit: float
    DF: float
    CF: float


class RunSizingResponse(BaseModel):
    place: str
    region_type: str

    # Total user-entered households connected to the three-phase transformer
    residential_units: int

    # Balanced phase allocation used for ADMD/DF/CF lookup
    residential_units_per_phase: float
    diversity_lookup_units_per_phase: float

    # Total unit count used for max-total-peak lookup
    peak_lookup_units_total: int

    # ADMD/DF/CF are now interpreted as per-phase lookup outputs
    ADMD_kW_per_unit: float
    DF: float
    CF: float

    # Max total peak is based on total residential units
    max_total_peak_kW: float

    # Diversified estimated total peak after applying per-phase CF
    group_peak_kW: float

    required_kVA: float
    design_kVA: float
    selected_transformer_kVA: float

    phase_balance_note: str
    trend_points: list[TrendPoint]
