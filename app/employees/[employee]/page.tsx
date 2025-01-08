import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; patient: string };
}): Promise<Metadata> {
  // const patientInfo = patients.find((p) => p.patientId === params?.patient);
  return {
    title: `CarePulse | Employee Not Found`,
    description: "HMS-EMR",
  };
}

export default function ViewPatient({
  params,
}: {
  params: { slug: string; patient: string };
}) {
  console.log(params?.patient);
  return <div>{/* <ViewEmployee params={params} /> */}</div>;
}
