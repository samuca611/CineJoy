export async function POST(request) {
  const unidade = await request.json();
  return Response.json({ id: Date.now(), ...unidade });
}
