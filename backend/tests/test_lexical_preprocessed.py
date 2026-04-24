from __future__ import annotations

from pathlib import Path

import pandas as pd

from modules.lexical_search.lexical_utils import (
    build_preprocessed_excel_cache,
    sanitize_excel_metadata_row,
    search_excel_file,
)


def test_search_excel_file_uses_preprocessed_cache(tmp_path: Path):
    xlsx_path = tmp_path / "LO.xlsx"
    cache_path = tmp_path / "cache" / "LO.ndjson"

    df = pd.DataFrame(
        [
            {"texto": "Acao evolutiva pratica", "pagina": "12"},
            {"texto": "Tema sem match", "pagina": "99"},
        ]
    )
    df.to_excel(xlsx_path, index=False)

    build_preprocessed_excel_cache(xlsx_path, output_path=cache_path)

    matches = search_excel_file(xlsx_path, "acao", preprocessed_path=cache_path)

    assert len(matches) == 1
    assert matches[0]["paragraph_text"] == "Acao evolutiva pratica"
    assert matches[0]["paragraph_number"] == 1
    assert matches[0]["metadata"]["pagina"] == "12"
    assert "__match_text_norm" not in matches[0]["metadata"]


def test_sanitize_excel_metadata_row_removes_internal_fields():
    row = {
        "texto": "Exemplo",
        "paragraph_number": 3,
        "__match_text_norm": "exemplo",
    }

    cleaned = sanitize_excel_metadata_row(row)

    assert cleaned == {"texto": "Exemplo", "paragraph_number": 3}
