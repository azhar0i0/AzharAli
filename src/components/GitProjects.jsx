import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Utility to fetch repo image
async function fetchRepoImage(username, repo) {
    const imageUrl = `https://raw.githubusercontent.com/${username}/${repo}/main/preview.png`;
    try {
        const res = await fetch(imageUrl, { method: "HEAD" });
        return res.ok ? imageUrl : null;
    } catch {
        return null;
    }
}

// ===== Custom Alert Component =====
function CustomAlert({ show, onVisit, content, onClose }) {
    const alertRef = React.useRef();

    // Close alert if click outside
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (alertRef.current && !alertRef.current.contains(event.target)) {
                onClose();
            }
        }

        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="custom-toast success"
                    style={{
                        width: "350px",
                        maxWidth: "90%",
                        padding: "20px",
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        lineHeight: "1.4",
                        zIndex: 9999,
                        backgroundColor: "#555023",
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        color: "#fff",
                    }}
                    ref={alertRef}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <h4 style={{ marginBottom: "5px", fontWeight: "bolder" }}>Dashboard Project</h4>
                        <div
                            style={{
                                background: "rgba(255,255,255,0.1)",
                                padding: "10px",
                                borderRadius: "8px",
                                fontFamily: "monospace",
                            }}
                        >
                            {content.map((line, index) => (
                                <p key={index} style={{ margin: "2px 0" }}>{line}</p>
                            ))}
                        </div>
                        <button
                            onClick={onVisit}
                            style={{
                                marginTop: "10px",
                                alignSelf: "flex-end",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#8E9048",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontWeight: "450",
                            }}
                        >
                            Visit Site <span style={{ fontSize: "1.1rem" }}>→</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


export default function GitProjects() {
    const username = "azhar0i0";
    const navigate = useNavigate();
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertContent, setAlertContent] = useState([]);
    const [alertUrl, setAlertUrl] = useState("");

    useEffect(() => {
        async function loadRepos() {
            try {
                const res = await fetch(`https://api.github.com/users/${username}/repos`, {
                    headers: { Accept: "application/vnd.github.mercy-preview+json" },
                });
                const data = await res.json();

                // Filter by portfolio-project or dashboard topic
                const filtered = data.filter(
                    (repo) => repo.topics?.includes("portfolio-project") || repo.topics?.includes("dashboard")
                );

                // Sort by latest first (descending)
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                const reposWithImages = await Promise.all(
                    filtered.map(async (repo) => {
                        const img = await fetchRepoImage(username, repo.name);
                        return {
                            name: repo.name,
                            desc: repo.description,
                            url: repo.homepage || repo.html_url,
                            image: img,
                            topics: repo.topics || [],
                        };
                    })
                );

                setRepos(reposWithImages);
            } catch (e) {
                console.error("Error fetching GitHub repos:", e);
            } finally {
                setLoading(false);
            }
        }

        loadRepos();
    }, [username]);

    const filteredRepos = useMemo(
        () => repos.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
        [repos, search]
    );

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5 } }),
        hover: { scale: 1.05, y: -5, boxShadow: "0px 15px 30px rgba(142,144,72,0.4)" },
    };

    const handleDashboardClick = (repo) => {
        setAlertContent([
            "Use credentials:",
            "Gmail: admin@company.com",
            "Password: admin.me",
        ]);
        setAlertUrl(repo.url);
        setShowAlert(true);
    };

    const handleVisitSite = () => {
        if (alertUrl) window.open(alertUrl, "_blank");
        setShowAlert(false);
    };

    return (
        <div className="container py-5">
            {/* Custom Alert */}
            <CustomAlert
                show={showAlert}
                onVisit={handleVisitSite}
                content={alertContent}
                onClose={() => setShowAlert(false)}
            />


            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold">GitHub Projects</h1>
                <p className="text-muted">Automatically fetched from GitHub — filtered by topic</p>
                <button onClick={() => navigate("/")} className="btn btn-outline-dark mt-3 rounded-pill">
                    ← Back to Home
                </button>
            </div>

            {/* Search Bar */}
            <div className="d-flex justify-content-center mb-5 w-100">
                <div className="position-relative">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="form-control text-dark search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="bi bi-search search-icon"></i>
                </div>
            </div>

            {/* Grid */}
            <div className="row g-4">
                {loading &&
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="col-sm-6 col-lg-4">
                            <div className="pro-skeleton-card">
                                <div className="pro-skeleton-img shimmer"></div>
                                <div className="pro-skeleton-line shimmer"></div>
                                <div className="pro-skeleton-line short shimmer"></div>
                            </div>
                        </div>
                    ))}

                {!loading &&
                    filteredRepos.map((repo, i) => (
                        <motion.div key={i} className="col-sm-6 col-lg-4" custom={i} variants={cardVariants} initial="hidden" animate="visible">
                            <div
                                className="pro-card"
                                onClick={() => {
                                    if (repo.topics.includes("dashboard")) {
                                        handleDashboardClick(repo);
                                    } else {
                                        window.open(repo.url, "_blank");
                                    }
                                }}
                            >
                                <div className="pro-card-img-wrap">
                                    {repo.image ? (
                                        <img src={repo.image} alt={repo.name} className="pro-card-img" />
                                    ) : (
                                        <div className="pro-card-img fallback">No Image</div>
                                    )}
                                    <div className="pro-card-shine"></div>
                                </div>

                                <div className="pro-card-body">
                                    <h4 className="pro-card-title">{repo.name}</h4>
                                    <p className="pro-card-desc">
                                        {repo.desc
                                            ? repo.desc.length > 400
                                                ? repo.desc.slice(0, 400) + "..."
                                                : repo.desc
                                            : "No description provided"}
                                    </p>

                                    <motion.button whileHover={{ scale: 1.07 }} className="pro-btn">
                                        Visit Project <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                {!loading && filteredRepos.length === 0 && (
                    <p className="text-center text-muted mt-5">No matching projects found.</p>
                )}
            </div>
        </div>
    );
}
