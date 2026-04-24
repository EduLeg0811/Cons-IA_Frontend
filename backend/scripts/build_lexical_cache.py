from __future__ import annotations

import argparse
import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from modules.lexical_search.lexical_utils import build_preprocessed_excel_cache
from utils.config import FILES_SEARCH_DIR, FILES_SEARCH_PREPROCESSED_DIR


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build NDJSON cache files for lexical Excel sources."
    )
    parser.add_argument(
        "--book",
        action="append",
        dest="books",
        help="Book stem to process (example: LO). Can be passed multiple times.",
    )
    parser.add_argument(
        "--source-dir",
        default=str(FILES_SEARCH_DIR),
        help="Directory containing source XLSX files.",
    )
    parser.add_argument(
        "--output-dir",
        default=str(FILES_SEARCH_PREPROCESSED_DIR),
        help="Directory where NDJSON cache files will be written.",
    )
    return parser.parse_args()


def iter_source_files(source_dir: Path, books: list[str] | None) -> list[Path]:
    if books:
        wanted = {book.strip().upper() for book in books if book and book.strip()}
        return sorted(
            path for path in source_dir.glob("*.xlsx") if path.stem.upper() in wanted
        )
    return sorted(source_dir.glob("*.xlsx"))


def main() -> int:
    args = parse_args()
    source_dir = Path(args.source_dir).resolve()
    output_dir = Path(args.output_dir).resolve()

    if not source_dir.exists():
        print(f"Source directory not found: {source_dir}")
        return 1

    files = iter_source_files(source_dir, args.books)
    if not files:
        print(f"No XLSX files found in {source_dir}")
        return 1

    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Building lexical cache from {source_dir}")
    print(f"Output directory: {output_dir}")

    for source_path in files:
        output_path = output_dir / f"{source_path.stem}.ndjson"
        build_preprocessed_excel_cache(source_path, output_path=output_path)
        size_kb = round(output_path.stat().st_size / 1024, 1)
        print(f"  ok  {source_path.name} -> {output_path.name} ({size_kb} KB)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
