export function MyProfileStatus() {
  return (
    <tr>
      <td className="pb-2">
        <div className="flex items-center gap-2 border border-orkut-border bg-white px-2 py-0.5 leading-tight">
          <span className="flex-1 font-[Tahoma] text-[12px] leading-tight tracking-[1.25px] text-[#999]">
            Defina seu status aqui
          </span>
          <button
            type="button"
            className="cursor-pointer rounded-[3px] border border-[#a0b0c4] bg-white px-1 py-px text-[13px] font-semibold leading-[1.25] text-orkut-link-dark no-underline"
          >
            editar
          </button>
        </div>
      </td>
    </tr>
  );
}
