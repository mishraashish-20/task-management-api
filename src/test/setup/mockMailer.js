import nodemailer from "nodemailer";
import { jest } from "@jest/globals";

export const sendMailMock = jest
  .fn()
  .mockResolvedValue({ messageId: "test-id" });

jest.spyOn(nodemailer, "createTransport").mockReturnValue({
  sendMail: sendMailMock,
});
