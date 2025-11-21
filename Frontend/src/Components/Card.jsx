export default function CardItem({ card }) {
  return (
    <div className="p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
      <strong className="text-lg">{card.title}</strong>
    </div>
  );
}
