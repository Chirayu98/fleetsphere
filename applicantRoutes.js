// PATCH /applicants/status/:id
router.patch('/status/:id', async (req, res) => {
  try {
    const updated = await Applicant.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Applicant not found" });
    res.json({ success: true, applicant: updated });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
});
