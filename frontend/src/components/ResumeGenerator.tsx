import React, { useRef, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

type ResumeOptions = {
  highlightSkills: boolean;
  optimizeATS: boolean;
  addTemperature: boolean;
  addSummary: boolean;
};

const defaultOptions: ResumeOptions = {
  highlightSkills: false,
  optimizeATS: false,
  addTemperature: false,
  addSummary: false,
};

const ResumeGenerator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [vacancy, setVacancy] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ResumeOptions>(defaultOptions);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    setOptions((prev) => ({
      ...prev,
      [name as keyof ResumeOptions]: checked,
    }));
  };

  const clearForm = () => {
    setFile(null);
    setVacancy("");
    setResult("");
    setOptions(defaultOptions);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generateResume = async () => {
    if (!vacancy.trim()) {
      setResult("Please paste a vacancy description first.");
      return;
    }

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    formData.append("vacancy", vacancy);
    formData.append("options", JSON.stringify(options));

    try {
      setLoading(true);
      setResult("Generating resume, please wait...");
      
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiBaseUrl}/generate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setResult(`Backend error: ${response.status}\n${errorText}`);
        return;
      }

      const data = await response.json();

      if (data.generatedResume) {
        setResult(data.generatedResume);
      } else {
        setResult(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("Error connecting to backend.");
    } finally {
      setLoading(false);
    }
  };

  const saveToDocx = async () => {
    if (!result.trim()) return;

    const lines = result.split("\n");

    const paragraphs = lines.map((line) => {
      if (!line.trim()) {
        return new Paragraph({
          children: [new TextRun("")],
          spacing: { after: 120 },
        });
      }

      return new Paragraph({
        children: [new TextRun({ text: line })],
        spacing: { after: 120 },
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "generated_resume.docx");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Resume Generator
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            component="label"
            disabled={loading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Upload Resume File
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".pdf,.doc,.docx,.rtf,.txt"
              onChange={handleFileChange}
            />
          </Button>

          {file && (
            <Typography variant="body1" sx={{ mt: 1.5 }} align="center">
              Uploaded: {file.name}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Paste Vacancy Description"
            multiline
            rows={4}
            fullWidth
            value={vacancy}
            onChange={(e) => setVacancy(e.target.value)}
            disabled={loading}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Options
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.highlightSkills}
                  onChange={handleOptionChange}
                  name="highlightSkills"
                  disabled={loading}
                />
              }
              label="Highlight Skills"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.optimizeATS}
                  onChange={handleOptionChange}
                  name="optimizeATS"
                  disabled={loading}
                />
              }
              label="Optimize for ATS"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.addTemperature}
                  onChange={handleOptionChange}
                  name="addTemperature"
                  disabled={loading}
                />
              }
              label="Add Temperature to Response"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.addSummary}
                  onChange={handleOptionChange}
                  name="addSummary"
                  disabled={loading}
                />
              }
              label="Add Professional Summary"
            />
          </FormGroup>
        </Box>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={generateResume}
            disabled={loading || !vacancy.trim()}
            sx={{ py: 1.5 }}
          >
            {loading ? "Generating..." : "Generate Resume"}
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={saveToDocx}
            disabled={!result.trim() || loading}
            sx={{ py: 1.5 }}
          >
            Save as DOCX
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={clearForm}
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            Clear
          </Button>
        </Stack>

        {loading && (
          <Box 
            sx={{ 
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="body1">
              Please wait, resume generation is in progress...
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <TextField
            multiline
            rows={16}
            fullWidth
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="Your generated resume will appear here..."
            variant="outlined"
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default ResumeGenerator;