---
layout: post
title: "Dynamic expression of genes in developing zebrafish"
date: "2022-07-11 17:47:54 +0800"
categories: biology shiny
---

I studied the development of the cardiovascular system using the zebrafish for my Ph. D.. Under the supervision of Didier Stainier, I have been fascinated by this research model. I recalled sitting by a microscope for an entire day, just to witness a fertilized egg morph into a zebrafish embryo. You can find many of these videos on Youtube:  

<iframe width="560" height="315" src="https://www.youtube.com/embed/ahJjLzyioWM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  

I have in fact made my own time lapse video to document how mutations to yap1 and wwtr1 (taz) genes of the Hippo signalling pathway interrupts the elongation of the posterior body:  

<iframe width="560" height="315" src="https://www.youtube.com/embed/4Eblc-VIsHg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  

The invariant trajectory of a developing zygote into a zebrafish is indeed quite a marvel, and is very much a product of a well-orchestrated genome - each gene is cued to express at the right time, in the right cells, at the right amount, and for a fixed duration. Disrupting a gene (sometimes a few genes), can give rise to malformed zebrafish embryos (such as the yap1;wwtr1 mutant example).  

How dynamic are these genes?  The [Ensembl](http://ensembl.org/) database has a comprehensive collection of zebrafish gene expression over development. I have downloaded these massive RNAseq datasets, processed them into read counts per gene using [htseq-count](https://www.ncbi.nlm.nih.gov/pubmed/25260700), and finally normalizing these read counts with [DESeq2](https://bioconductor.org/packages/release/bioc/html/DESeq2.html). These plots are then generated with plotly. Here's an example of a plot with two of my favorite genes in the Hippo signaling pathway.  

{% include image.html url="/assets/img/biology_191107.png" description="Gene expression of yap1 and wwtr1 genes over zebrafish development. ss - somite stage; hpf - hours post-fertilization; dpf - days post-fertilization" %}  

You can see how *yap1* is not only maternally contributed, but its expression is sustained all the way until 5 dpf. In contrast, *wwtr1* is not maternally contributed, it's expression comes on some time during transition from gastrulation into segmentation stages.  

You can find an interactive version of this plot [here](https://plotproject.shinyapps.io/zfish_expression/).  Note: this interactive plot takes a while to load and update (My hunch is that the underlying data set is huge, and so it takes a while for my FOC shinyapps server to process each request).  

_Updates_

7/11/2019: Plot space throws out a blank page instead of an error.  

9/11/2019: Fixed slow loading issue.  Turns out one of the widget was under the control of "conditionalPanel" which was the wrong function to call for what I want to achieve. The plot should load faster, unless multiple users are accessing it at the same time.  

9/11/2019: Added a 'loading' animation.  
