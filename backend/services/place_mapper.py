PLACE_TO_REGION = {
    "Gaborone": "city",
    "Francistown": "city",

    "Jwaneng": "town",
    "Selebi-Phikwe": "town",
    "Orapa": "town",
    "Lobatse": "town",
    "Kasane": "town",
    "Mahalapye": "town",
    "Palapye": "town",

    "Molepolole": "village",
    "Serowe": "village",
    "Maun": "village",
    "Kanye": "village",
    "Mochudi": "village",
    "Ramotswa": "village",
    "Tlokweng": "village",
    "Letlhakane": "village",
    "Thamaga": "village",
    "Mogoditshane": "village",
}


def get_region_from_place(place: str) -> str:
    if place not in PLACE_TO_REGION:
        raise ValueError(
            f"Unknown place '{place}'. Add it to PLACE_TO_REGION."
        )
    return PLACE_TO_REGION[place]