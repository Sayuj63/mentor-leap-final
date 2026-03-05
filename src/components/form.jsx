import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function LeadForm() {
  const receivingEmail = import.meta.env.VITE_FORMSUBMIT_EMAIL || "teammarktaleworld@gmail.com" ;
  const ccEmail = import.meta.env.VITE_FORMSUBMIT_CC || "";

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
          action={`https://formsubmit.co/${receivingEmail}`}
          method="POST"
          className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-5"
        >
          <input type="hidden" name="_subject" value="New Website Lead" />
          <input type="hidden" name="_template" value="table" />
          <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
          {ccEmail ? <input type="hidden" name="_cc" value={ccEmail} /> : null}

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
                className="w-full h-9 rounded-md border border-input bg-input-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                <option value="">Select a program</option>
                <option>Personal Development</option>
                <option>Boot camp</option>
                <option>Hire Mridu as an Anchor</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
            <Textarea id="message" name="message" placeholder="Tell us your goal or query..." className="min-h-28" />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base">
            Submit
          </Button>

          <p className="text-xs text-slate-500">
            First submission requires inbox verification by FormSubmit. Check the receiving email and activate the form once.
          </p>
        </form>
      </div>
    </section>
  );
}
