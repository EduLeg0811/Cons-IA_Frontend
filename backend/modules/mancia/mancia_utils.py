import logging
import random
import re
from pathlib import Path

from modules.lexical_search.lexical_utils import iter_preprocessed_excel_rows
from utils.config import FILES_SEARCH_PREPROCESSED_DIR

logger = logging.getLogger(__name__)


#Sorteia uma frase do livro Léxico de Ortopensatas
#========================================================
def get_random_paragraph(filename: str, term: str) -> dict:
    try:
        base_dir = Path(FILES_SEARCH_PREPROCESSED_DIR).resolve()
        stem = Path(filename).stem
        ndjson_path = base_dir / f"{stem}.ndjson"
        md_path = base_dir / f"{stem}.md"

        if ndjson_path.exists():
            rows = list(iter_preprocessed_excel_rows(ndjson_path))
            text_key = next(
                (k for k in (rows[0].keys() if rows else [])
                 if k != "paragraph_number" and not str(k).startswith("__")),
                None
            )
            valid_rows = [row for row in rows if str(row.get(text_key, "")).strip()] if text_key else []

            if not valid_rows:
                raise ValueError(f"No valid paragraphs found in file: {filename}")

            selected_row = random.choice(valid_rows)
            selected_paragraph = str(selected_row.get(text_key, "")).strip()
            cleaned_paragraph = re.sub(r'^\d+[\.\s]*', '', selected_paragraph).strip()

            return {
                "paragraph": cleaned_paragraph,
                "paragraph_number": selected_row.get("paragraph_number", ""),
                "total_paragraphs": len(valid_rows),
                "pagina": str(selected_row.get("pagina", "")).strip(),
                "source": ndjson_path.name
            }

        if md_path.exists():
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read().replace('\r\n', '\n')
            paragraphs = [p.strip() for p in content.split('\n') if p.strip()]
            if not paragraphs:
                raise ValueError(f"No valid paragraphs found in file: {filename}")
            random_index = random.randint(0, len(paragraphs) - 1)
            cleaned_paragraph = re.sub(r'^\d+[\.\s]*', '', paragraphs[random_index]).strip()
            return {
                "paragraph": cleaned_paragraph,
                "paragraph_number": random_index + 1,
                "total_paragraphs": len(paragraphs),
                "pagina": "",
                "source": md_path.name
            }

        raise FileNotFoundError(f"File not found in preprocessed dir: {filename}")

    except Exception as error:
        logger.error(f"Error in get_random_paragraph: {str(error)}")
        raise
       

