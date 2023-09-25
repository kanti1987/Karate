package karate;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Scanner;

import net.masterthought.cucumber.Configuration;
import net.masterthought.cucumber.ReportBuilder;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;


public class RunnerTest {

 @Test
 void testSample() {
//     System.out.println("Enter the env:");
//     Scanner sc = new Scanner(System.in);
//     String env= sc.nextLine();
     System.setProperty("karate.env", "test");

        Results results = Runner.path("classpath:karate/APIDATA.feature")//   Database.feature karate/API.feature to run only API.feature file
                .outputCucumberJson(true)
                .parallel(0); // threadCount: 5 for single run
        generateReport(results.getReportDir());
     assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }
    public static void generateReport(String karateOutputPath) {
        Collection<File> jsonFiles = FileUtils.listFiles(new File(karateOutputPath), new String[] {"json"}, true);
        List<String> jsonPaths = new ArrayList<>(jsonFiles.size());
        jsonFiles.forEach(file -> jsonPaths.add(file.getAbsolutePath()));
        Configuration config = new Configuration(new File("target"), "demo");
        ReportBuilder reportBuilder = new ReportBuilder(jsonPaths, config);
        reportBuilder.generateReports();
    }
}

