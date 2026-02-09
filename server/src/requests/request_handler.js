export const getBody = (request, contentType) =>
  contentType === "application/json" ? request.json() : request.text();

export const parse = async (request) => {
  const { origin: baseUrl, pathname: path } = new URL(request.url);
  const { method } = request;
  let body = "";

  if (method === "POST") {
    const contentType = request.headers.get("content-type");
    body = await getBody(request, contentType);
  }

  return { body, baseUrl, path, method };
};

export const requestHandler = async (request) => {
  const { method, baseUrl, path, body } = await parse(request);
  return new Response("hi");
};
