import { NextRequest, NextResponse } from "next/server";
import * as pug from "pug";
import Handlebars from "handlebars";

export async function POST(request: NextRequest) {
  try {
    const { code, language, variables = {} } = await request.json();

    let html = "";

    switch (language) {
      case "pug":
        html = pug.render(code, variables);
        break;
      case "handlebars":
        const template = Handlebars.compile(code);
        html = template(variables);
        break;
      default:
        html = code;
    }

    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Compilation error" },
      { status: 400 }
    );
  }
}
