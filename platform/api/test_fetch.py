import asyncio
from httpx import AsyncClient

async def main():
    # we can't easily generate a real clerk jwt, but we can check if the API is even running
    async with AsyncClient() as client:
        res = await client.get("http://localhost:8000/templates")
        print("Status", res.status_code)
        print("Body", res.text)

asyncio.run(main())
