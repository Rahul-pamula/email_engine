"""
File Parser Utility
Reusable parsing helper for CSV and Excel files.

Supported: .csv, .xlsx
Unsupported: .xls, .pdf, .txt

Edge cases handled:
- Blank first row in Excel
- Empty trailing rows
- Columns with extra whitespace
- NaN values
"""
import io
import pandas as pd
from fastapi import HTTPException


SUPPORTED_EXTENSIONS = (".csv", ".xlsx")


def parse_file(contents: bytes, filename: str) -> pd.DataFrame:
    """
    Parse uploaded file into a pandas DataFrame.

    - Detects file type by extension
    - Uses pandas + openpyxl for .xlsx
    - Handles blank first rows (promotes first data row to header)
    - Drops fully empty rows
    - Strips whitespace from column names
    - Raises HTTP 400 for unsupported types or parse errors
    """
    filename_lower = filename.lower()

    if not filename_lower.endswith(SUPPORTED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Accepted: {', '.join(SUPPORTED_EXTENSIONS)}"
        )

    try:
        if filename_lower.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif filename_lower.endswith(".xlsx"):
            # Read without assuming headers first to detect blank rows
            df_raw = pd.read_excel(
                io.BytesIO(contents),
                engine="openpyxl",
                sheet_name=0,
                header=None  # Don't assume first row is header
            )

            # Drop fully empty rows from top
            df_raw.dropna(how="all", inplace=True)
            df_raw.reset_index(drop=True, inplace=True)

            if df_raw.empty:
                raise HTTPException(status_code=400, detail="File is empty")

            # Use first non-empty row as header
            headers = df_raw.iloc[0].astype(str).str.strip()
            df = df_raw.iloc[1:].copy()
            df.columns = headers
            df.reset_index(drop=True, inplace=True)

        # Normalize column names
        df.columns = df.columns.str.strip()

        # Drop fully empty rows
        df.dropna(how="all", inplace=True)

        # Reset index after dropping
        df.reset_index(drop=True, inplace=True)

        if df.empty:
            raise HTTPException(status_code=400, detail="File contains no data rows")

        return df

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to parse file: {str(e)}"
        )
