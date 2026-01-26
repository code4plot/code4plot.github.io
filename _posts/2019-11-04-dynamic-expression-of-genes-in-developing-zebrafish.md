---
layout: post
title: "Dynamic Gene Expression During Zebrafish Development"
subtitle: "Large-scale RNA-seq analysis and interactive visualization of developmental gene dynamics"
---

## Project Overview
This project analyzes how gene expression changes over zebrafish development, using large-scale RNA-seq data to quantify temporal dynamics and visualize expression trajectories interactively.

The objective was to move beyond static snapshots of gene activity and instead characterize **when**, **how strongly**, and **for how long** genes are expressed during development—with a focus on genes involved in the Hippo signaling pathway.

---

## Context
Zebrafish are a powerful model for studying vertebrate development due to their optical transparency and highly reproducible developmental stages. Proper development depends on tightly regulated gene expression: each gene must activate at the right time, in the right tissue, and for the correct duration.

Disruptions to this regulation—such as mutations in key signaling genes—can lead to severe morphological defects. Understanding these dynamics requires time-resolved, quantitative data rather than qualitative observation alone.

---

## Data
- **Source:** Public zebrafish RNA-seq datasets from the Ensembl database  
- **Scope:** Genome-wide expression profiles across multiple developmental stages  
- **Scale:** Tens of thousands of genes measured across early embryogenesis through larval stages  

---

## Methodology
1. **Data Processing**
   - Downloaded raw RNA-seq datasets from Ensembl
   - Quantified gene-level read counts using `htseq-count`
2. **Normalization**
   - Normalized raw counts with `DESeq2` to account for sequencing depth and technical variability
3. **Analysis & Visualization**
   - Extracted temporal expression profiles for genes of interest
   - Built interactive visualizations using `plotly`
   - Deployed an interactive dashboard using **Shiny**

---

## Case Study: Hippo Signaling Pathway
As a concrete example, this project examines two key genes in the Hippo signaling pathway:
- **yap1**
- **wwtr1 (taz)**

Key observations:
- *yap1* is **maternally contributed** and shows sustained expression through at least 5 days post-fertilization
- *wwtr1* is **not maternally expressed** and activates later, around the transition from gastrulation to segmentation

These contrasting temporal patterns highlight how closely related genes can play distinct developmental roles.

---

## Output
- Interactive time-series plots of gene expression across developmental stages
- Ability to explore expression trajectories dynamically rather than relying on static figures

👉 **Interactive visualization:**  
https://plotproject.shinyapps.io/zfish_expression/

> Note: due to the size of the underlying dataset, initial load and interactions may be slow.

---

## Impact
- Demonstrates how large-scale biological datasets can be transformed into interpretable, interactive tools
- Bridges experimental biology with reproducible data analysis workflows
- Provides a template for exploring temporal dynamics in other developmental or longitudinal RNA-seq datasets

---

## Tools & Technologies
- RNA-seq
- htseq-count
- DESeq2
- R / Shiny
- Plotly
