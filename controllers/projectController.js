const fetch = require('cross-fetch');

exports.createProject = async (req, res) => {
    const { projectName, teamName } = req.body;
    try {
        const response = await fetch('https://66699c882e964a6dfed5dab5.mockapi.io/api/v1/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projectName, teamName })
        });
        const data = await response.json();
        const projectId = data.id;
        res.redirect(`/kanban?projectId=${projectId}&projectName=${projectName}`);
    } catch (error) {
        console.error('Erro ao criar projeto:', error);
        return res.status(500).send('Erro ao criar projeto.');
    }
};

exports.joinProject = async (req, res) => {
    const { teamName, teamCode } = req.body;
    try {
        const response = await fetch(`https://66699c882e964a6dfed5dab5.mockapi.io/api/v1/projects?teamName=${teamName}&id=${teamCode}`);
        const projectData = await response.json();
        if (projectData.length > 0) {
            const { projectId, projectName, teamName, id } = projectData[0];
            res.redirect(`/kanban?projectId=${projectId}&projectName=${projectName}&teamName=${teamName}&teamCode=${id}`);
        } else {
            res.redirect('/joinProject?error=invalid_team');
        }
    } catch (error) {
        console.error('Erro ao aderir ao projeto:', error);
        return res.status(500).send('Erro ao aderir ao projeto.');
    }
};
