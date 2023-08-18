import { NextResponse } from "next/server";

export async function GET(req, { params }) {
   try {
      const url = decodeURIComponent(params.slug)
      const res = await fetch(url, { method: 'GET' });
      const resultinJson = await res.json()
      const formattedResult = { name: resultinJson.name, description: resultinJson.description, image: resultinJson.image }
      return new NextResponse(JSON.stringify(formattedResult), {status: 200})
   } catch (error) {
      console.log(error)
      return new NextResponse('Internal Server Error', { status: 500 })
   }
}