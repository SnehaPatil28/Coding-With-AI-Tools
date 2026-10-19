import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

const apiUrl = "http://127.0.0.1:5000/api/students";

function uniqueStudent(overrides = {}) {
  return {
    name: "E2E Student",
    roll_number: `e2e-${randomUUID()}`,
    department: "Quality Assurance",
    marks: "87.5",
    ...overrides,
  };
}

async function removeStudent(request, studentId) {
  if (studentId === undefined) return;

  const response = await request.delete(`${apiUrl}/${studentId}`);
  if (!response.ok()) {
    console.warn(
      `Test cleanup could not delete student ${studentId}: ${response.status()}`,
    );
  }
}

test("adds a student through the React form", async ({ page, request }) => {
  const student = uniqueStudent();
  let createdStudentId;

  try {
    await page.goto("/");
    await page.getByPlaceholder("Name", { exact: true }).fill(student.name);
    await page
      .getByPlaceholder("Roll Number", { exact: true })
      .fill(student.roll_number);
    await page
      .getByPlaceholder("Department", { exact: true })
      .fill(student.department);
    await page.getByPlaceholder("Marks", { exact: true }).fill(student.marks);

    const createResponsePromise = page.waitForResponse(
      (response) =>
        response.url() === apiUrl && response.request().method() === "POST",
    );
    await page
      .getByRole("button", { name: "Add Student", exact: true })
      .click();
    const createResponse = await createResponsePromise;
    expect(createResponse.status()).toBe(201);
    createdStudentId = (await createResponse.json()).id;

    const studentRow = page
      .getByRole("row")
      .filter({ hasText: student.roll_number });
    await expect(studentRow).toBeVisible();
    await expect(studentRow.locator("td")).toHaveText([
      String(createdStudentId),
      student.name,
      student.roll_number,
      student.department,
      student.marks,
      "Edit Delete",
    ]);
  } finally {
    await removeStudent(request, createdStudentId);
  }
});

test("edits a student in the UI and verifies persistence through the API", async ({
  page,
  request,
}) => {
  const originalStudent = uniqueStudent({ marks: 72 });
  let createdStudentId;

  try {
    const createResponse = await request.post(apiUrl, {
      data: originalStudent,
    });
    expect(createResponse.status()).toBe(201);
    const createdStudent = await createResponse.json();
    createdStudentId = createdStudent.id;

    const updatedStudent = {
      name: "Updated E2E Student",
      department: "Software Testing",
      marks: "96.5",
    };

    await page.goto("/");
    const studentRow = page
      .getByRole("row")
      .filter({ hasText: originalStudent.roll_number });
    await expect(studentRow).toBeVisible();
    await studentRow.getByRole("button", { name: "Edit", exact: true }).click();

    await page
      .getByPlaceholder("Name", { exact: true })
      .fill(updatedStudent.name);
    await page
      .getByPlaceholder("Department", { exact: true })
      .fill(updatedStudent.department);
    await page
      .getByPlaceholder("Marks", { exact: true })
      .fill(updatedStudent.marks);

    const updateResponsePromise = page.waitForResponse(
      (response) =>
        response.url() === `${apiUrl}/${createdStudentId}` &&
        response.request().method() === "PUT",
    );
    await page
      .getByRole("button", { name: "Update Record", exact: true })
      .click();
    const updateResponse = await updateResponsePromise;
    expect(updateResponse.status()).toBe(200);

    const updatedRow = page
      .getByRole("row")
      .filter({ hasText: originalStudent.roll_number });
    await expect(updatedRow.locator("td")).toHaveText([
      String(createdStudentId),
      updatedStudent.name,
      originalStudent.roll_number,
      updatedStudent.department,
      updatedStudent.marks,
      "Edit Delete",
    ]);

    const getResponse = await request.get(`${apiUrl}/${createdStudentId}`);
    expect(getResponse.status()).toBe(200);
    await expect(getResponse).toBeOK();
    expect(await getResponse.json()).toMatchObject({
      id: createdStudentId,
      name: updatedStudent.name,
      roll_number: originalStudent.roll_number,
      department: updatedStudent.department,
      marks: Number(updatedStudent.marks),
    });
  } finally {
    await removeStudent(request, createdStudentId);
  }
});
