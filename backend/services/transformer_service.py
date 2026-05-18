STANDARD_TRANSFORMERS_KVA = [25, 50, 100, 160, 200, 250, 315, 400, 500, 630, 800, 1000]


def select_standard_transformer(required_kva: float) -> float:
    for rating in STANDARD_TRANSFORMERS_KVA:
        if rating >= required_kva:
            return float(rating)
    return float(STANDARD_TRANSFORMERS_KVA[-1])


def size_transformer_cf(
    max_total_peak_kw: float,
    coincidence_factor: float,
    power_factor: float,
    margin: float,
) -> dict:
    """
    Three-phase VoltSizer sizing interpretation.

    max_total_peak_kw:
        Maximum peak demand obtained from the peak lookup table using the
        total number of residential units.

    coincidence_factor:
        Coincidence factor obtained from the ADMD/DF/CF lookup table using
        units per phase, i.e. total residential units divided by 3.

    The diversified estimated total peak is:
        group_peak_kw = max_total_peak_kw * coincidence_factor
    """
    group_peak_kw = max_total_peak_kw * coincidence_factor
    required_kva = group_peak_kw / power_factor
    design_kva = required_kva * (1.0 + margin)
    selected_transformer_kva = select_standard_transformer(design_kva)

    return {
        "max_total_peak_kW": float(max_total_peak_kw),
        "group_peak_kW": float(group_peak_kw),
        "required_kVA": float(required_kva),
        "design_kVA": float(design_kva),
        "selected_transformer_kVA": float(selected_transformer_kva),
    }
