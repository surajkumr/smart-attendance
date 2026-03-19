function Card({ title, value }) {
  return (
    <div className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-3xl font-bold mt-3 text-indigo-600 dark:text-indigo-400">
        {value}
      </p>
    </div>
  );
}

export default Card;