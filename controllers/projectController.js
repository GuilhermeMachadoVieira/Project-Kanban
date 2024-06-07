exports.createProject = (req, res) => {
    const { projectName, teamName } = req.body;
    db.run(`INSERT INTO projects (projectName, teamName) VALUES (?, ?)`, [projectName, teamName], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao criar projeto.');
        }
        res.redirect(`/kanban?projectId=${projectId}&projectName=${projectName}`);

    });
};