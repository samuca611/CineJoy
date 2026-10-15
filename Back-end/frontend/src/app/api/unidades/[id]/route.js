export async function PUT(request, { params }) {
  const unidade = await request.json();
  return Response.json({ id: Number(params.id), ...unidade });
}

export function DELETE() {
  return new Response(null, { status: 204 });
}
