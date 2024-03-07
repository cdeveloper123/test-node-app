const axios = require("axios");

const API_KEY = process.env.API_KEY;
const FORM_ID = process.env.FORM_ID;

async function getFilteredResponses(req, res) {
  try {
    let filters = req.query.filters || [];
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 10;

    if (!API_KEY || !FORM_ID) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (!Array.isArray(filters)) {
      try {
        filters = JSON.parse(filters);
      } catch (jsonError) {
        res.status(400).json({ error: "Invalid JSON in filters" });
        return;
      }
    }

    const url = process.env.URL;

    const filloutApiResponse = await axios.get(`${url}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const filteredResponses = applyFilters(
      filters,
      filloutApiResponse.data,
      page,
      size
    );

    const updatedResponse = {
      responses: filteredResponses.responses,
      totalResponses: filteredResponses.totalResponses,
      pageCount: filteredResponses.pageCount,
    };

    res.json(updatedResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function applyFilters(filter, responseData, page, size) {
  const startIndex = (page - 1) * size;
  const endIndex = page * size;

  const filteredQuestions = responseData.questions.filter((question) => {
    if(filter.length===0){
      return responseData.questions
    }
    else{
      return filter.some(
        (filterItem) =>
          filterItem.id === question.id && filterItem.type === question.type && filterItem.name === question.name
      );
    }
  });

  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  return {
    responses: [
      {
        questions: paginatedQuestions,
        submissionId: "cLZojxk94ous",
        submissionTime: new Date().toISOString(),
      },
    ],
    totalResponses: filteredQuestions.length,
    pageCount: Math.ceil(filteredQuestions.length / size),
  };
}

module.exports = {
  getFilteredResponses,
};
