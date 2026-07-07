import fortunes from "@/data/fortunes.json";

function getFortuneOfTheDay(): string {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const keys = Object.keys(fortunes);
  const index = dayOfYear % keys.length;
  return fortunes[keys[index] as keyof typeof fortunes];
}

export function FortuneOfTheDay() {
  const fortune = getFortuneOfTheDay();

  return (
    <div className="py-1 font-[Tahoma] text-[14px] font-bold text-[#333]">
      Sorte do dia: <span className="font-normal">{fortune}</span>
    </div>
  );
}
