import { redirect } from "next/navigation";

export default function CurriculumAddRedirect() {
  redirect("/student/curriculum/manage");
}
