import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function LeadForm() {
  const [selectedProgram, setSelectedProgram] = useState("");
  const isBootcamp = selectedProgram === "Speak with Impact Bootcamp";

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Add the program manually since it's controlled
    data.program_interest = selectedProgram;

    try {
      // In production, the server is the same as the frontend, so we use a relative path
      const apiUrl = import.meta.env.PROD
        ? ''
        : (import.meta.env.VITE_API_URL || 'http://localhost:3001');

      const response = await fetch(`${apiUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Application submitted successfully! We will get back to you soon.");
        e.target.reset();
        setSelectedProgram("");

        if (isBootcamp) {
          window.location.href = "https://rzp.io/l/xyXPRm3";
        }
      } else {
        setErrorMessage(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="lead-form" className="py-20 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-[0.14em] uppercase text-blue-600">Enroll Now</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">
            Join the Program
          </h2>
          <p className="text-slate-600 mt-3">
            Fill out the form and we will send your details directly to our inbox for quick follow-up.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-5"
        >
          {successMessage && (
            <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
              {errorMessage}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">Your Name</label>
              <Input id="name" name="name" type="text" placeholder="Enter your full name" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                inputMode="numeric"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="profession" className="text-sm font-medium text-slate-700">Profession</label>
              <Input id="profession" name="profession" type="text" placeholder="Your Profession" required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-slate-700">Location</label>
              <Input id="location" name="location" type="text" placeholder="City / State" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="program_interest" className="text-sm font-medium text-slate-700">Program Interest</label>
              <select
                id="program_interest"
                name="program_interest"
                required
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-input-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                <option value="">Select a program</option>
                <option value="Personality Development Masterclass">Personality Development Masterclass</option>
                <option value="Hire Mridu as an Anchor">Hire Mridu as an Anchor</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
            <Textarea id="message" name="message" placeholder="Tell us your goal or query..." className="min-h-28" />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base">
            {loading ? "Submitting..." : (isBootcamp ? "Proceed to Payment" : "Submit")}
          </Button>

          <p className="text-xs text-slate-500">
            By submitting this form, you agree to receive communications from MentorLeap.
          </p>
        </form>
      </div>
    </section>
  );
}
