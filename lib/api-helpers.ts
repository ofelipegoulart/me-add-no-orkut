import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function authenticatedFetch(
  path: string,
  init?: RequestInit,
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Para FormData, deixamos o fetch definir o Content-Type (com o boundary do
  // multipart). Só definimos application/json para os demais bodies.
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(`${process.env.API_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${session.user.jwt}`,
      ...init?.headers,
    },
  });

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
