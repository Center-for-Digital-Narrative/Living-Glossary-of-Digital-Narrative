---
title: Machine Learning
description: Subset of artificial intelligence that involves the development of algorithms that allow computers to learn and adapt through experience, used in digital narratives to generate content or enhance interactivity
author: Charlotte Ammer
pubDate: 2026-05-27
seeAlso:
  - chatbot
  - algorithmic-narrativity
  - artificial-intelligence-ai
worksReferenced: |-
  Alpaydin, Ethem. _Machine Learning_. MIT Press, 2021. 

  Pustejovsky, James, and Amber Stubbs. _Natural Language Annotation for Machine Learning: A Guide to Corpus-building for Applications_. O'Reilly Media. 2012. 

  Wei, Jiaheng, et al. "Measuring and Reducing LLM Hallucination without Gold-Standard Answers." _arXiv preprint arXiv:2402.10412_, 2024.  

  Zweig, Katharina. _Ein Algorithmus hat kein Taktgefühl: Wo künstliche Intelligenz sich irrt, warum uns das betrifft und was wir dagegen tun können_. Heyne Verlag, 2019.
furtherReading: 'Maleki, Negar, Balaji Padmanabhan, and Kaushik Dutta. "AI Hallucinations: a Misnomer Worth Clarifying." _2024 IEEE conference on artificial intelligence (CAI)_. IEEE, 2024.'
---

A machine learning algorithm is made up of two parts: _machine_, which describes a computational process, and _learning_, because the algorithm is improving and becoming optimized to solve a problem by experience. While rule-based systems are implemented with a fixed set of rules and then used for a specific task, machine learning algorithms derive the rules from exemplary data and improve over time, given exposure to data. 

"Machine learning is the name given to the area of [Artificial Intelligence](https://glossary.cdn.uib.no/terms/artificial-intelligence-ai/) concerned with the development of algorithms that learn or improve their performance from experience or previous encounters with data. They are said to learn (or generate) a function that maps particular input data to the desired output" (Pustejovsky 20). Machine learning is particularly used in environments where a hard-coded, rule-based algorithm does not suffice. The most popular environment in such is artificial intelligence. "Machine learning is not just a database or programming problem; it is also a requirement for artificial intelligence. A system that is in a changing environment should have the ability to learn" (Alpaydin 19). In a fast-paced environment such as the digital world today, an adapting system is helpful because algorithm engineers can hardly foresee every possible situation that might occur at a later point in time. 

Two versions of artificial intelligence must be distinguished: _weak_ artificial intelligence and _strong_ artificial intelligence. Weak AI can only solve a specific problem, while strong AI can solve multiple problems and is generally reacting intelligently (Zweig126). In general, strong AI is a concept of the future. 

Within the realm of machine learning, we distinguish supervised and unsupervised learning algorithms. Both forms of learning require a dataset, but the usage of the data differs. Supervised learning describes the process of an algorithm detecting patterns within a given set of examples and a set of gold-standard labels, which are typically human-annotated. Using these labels, the algorithm learns the intended relation (Pustejovsky 21). Typically, after the initial training, the algorithm is tested using unseen data and can then be used or even fine-tuned with new datasets indefinitely. Unsupervised learning refers to the algorithm clustering data by finding structures within a set of data, which is unlabeled and has no human annotation or guidelines (Pustejovsky 21). Unsupervised learning cannot be guided into a certain direction; it will find patterns within the data which might not be detectable for humans. 

Large language models (LLMs) require a gigantic amount of textual data to train an algorithm on a language. [Chatbots](https://glossary.cdn.uib.no/terms/chatbot/) like ChatGPT have been trained on copyright-free parts of the internet, such as books without copyright, forums, manuals, and more. Using these large amounts of text, the language models have learned the probabilities of word occurrences and are able to emulate conversations. 

In digital narratives, machine learning based algorithms such as LLMs serve as a way to generate and analyze narrative data (Alpaydin 85-87). Because machine learning algorithms are trained on specific sets of data, the risk of _overfitting_ must be taken into consideration. Overfitting describes the process of an algorithm being too close to the gold-standard dataset in its predictions, making it stiff and unable to adjust to new data. The problem can be solved by introducing errors into the system. 

Large language models have their own set of risks that come with the territory. Because chatbots emulate human dialogue, their knowledge can easily be taken for granted. However, these models form sentences based on word probability, which introduces the concept of _hallucination_ (Wei 2024). When a system hallucinates, it produces text containing false claims about a topic, because it was the most likely word prediction. These hallucinations can be hard to catch. Within academia, hallucinations can be a risk factor, since articles mentioned by a chatbot might not exist or might contain different content than the ones claimed by the system.
