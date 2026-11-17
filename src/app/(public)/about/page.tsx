export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-4xl font-bold">How It Works</h1>
      <p className="mt-4 text-gray-600">
        FixMate connects customers with verified repair technicians for smartphones, laptops, ACs,
        refrigerators, TVs, washing machines and electrical work. Every job follows a clear,
        trackable pipeline — and payment happens only after the work is delivered.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {[
          ['1. Create an account', 'Sign up as a Customer or Technician — your role decides your dashboard.'],
          ['2. Browse & request', 'Customers browse approved services and send a repair request with the problem description.'],
          ['3. Track the job', 'Technicians move the job through Requested → Accepted → In Progress → Completed.'],
          ['4. Pay after service', 'Once completed, pay securely with Stripe. The technician earns, you relax.'],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-gray-500">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
