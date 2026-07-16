import Link from "next/link";

export function DeleteAccountNoticePage() {
  return (
    <div className="p-2">
      <p className="font-[Arial,Helvetica,sans-serif] text-[12px] text-black leading-[16px] mb-2">
        Para excluir a sua conta, clique no link abaixo. Ele vai levar você à página de Contas
        do Google, onde você vai ser solicitado a inserir sua senha. Clique no link
        &quot;Excluir minha conta&quot; para confirmar que deseja excluir.
      </p>
      <p className="font-[Arial,Helvetica,sans-serif] text-[12px] text-black leading-[16px] mb-3">
        Observação: A sua conta será excluída em breve. Enquanto isso, não acesse seu perfil,
        já que essa ação poderá restaurar a conta.
      </p>
      <p className="text-center">
        <Link
          href="/account/deleteAccount"
          className="font-[Arial,Helvetica,sans-serif] text-[12px] text-orkut-link-dark underline"
        >
          excluir minha conta
        </Link>
      </p>
    </div>
  );
}
