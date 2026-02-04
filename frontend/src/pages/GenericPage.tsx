const Page = ({ title }: { title: string }) => (
  <div className="pt-24 pb-16 container mx-auto px-4 min-h-screen">
    <h1 className="text-4xl font-bold text-primary mb-6">{title}</h1>
    <p className="text-lg text-gray-600">
      Content for {title} is under development.
    </p>
  </div>
);

export default Page;
